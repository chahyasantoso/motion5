import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
const root = fileURLToPath(new URL("../../../../../", import.meta.url));
function scenario(body: string) {
  const source = String.raw`
import assert from "node:assert/strict";
import { receipt } from "./scripts/automation-receipt.mjs";
import { collectDiagnostics, reportCompletedRun, GitHub } from "./scripts/automation-report.mjs";
import { publishRun, recoverRun } from "./scripts/automation-publish.mjs";
const A="a".repeat(40), B="b".repeat(40), C="c".repeat(40), repository="chahyasantoso/motion5";
const run={id:42,run_attempt:1,workflow_id:7,head_sha:B,head_branch:"test/diagnostics",event:"push",path:".github/workflows/ai-edit.yml",status:"completed",conclusion:"failure",repository:{full_name:repository},head_repository:{full_name:repository}};
const value=receipt({kind:"ai-edit",repository,run_id:42,run_attempt:1,request_commit:B,phase:"selection"});
const saved=new Map(), comments=[]; let logCalls=0,currentHead=B,failComment=false;
const missing=()=>{const e=new Error("missing");e.status=404;throw e;};
const api={repository,head:async()=>A,
content:async(path)=>{if(path===run.path)return {sha:A}; if(!saved.has(path))return missing();return {text:saved.get(path)};},
failedLogs:async(input)=>{logCalls++;assert.equal(input.id,run.id);assert.equal(input.run_attempt,run.run_attempt);return "setup\nError: Stale source SHA\n<script>@everyone</script> token=fixture-sensitive";},
persist:async(files)=>{for(const [path,text] of Object.entries(files)){assert.ok(!saved.has(path)||saved.get(path)===text,"historical evidence changed");saved.set(path,text);}},
list:async(path)=>{if(path.startsWith("/commits/"))return [{number:9,state:"open",base:{repo:{full_name:repository}},head:{repo:{full_name:repository},ref:run.head_branch}}];if(path==="/issues/9/comments")return comments;assert.fail("unexpected list "+path);},
request:async(method,path,data)=>{if(method==="GET"&&path==="/pulls/9")return {state:"open",head:{repo:{full_name:repository},ref:run.head_branch,sha:currentHead}};if(["POST","PATCH"].includes(method)&&path.startsWith("/issues/")){if(failComment)return missing();const c={id:8,user:{id:41898282,type:"Bot"},body:data.body};if(comments.length)comments[0]=c;else comments.push(c);return;}assert.fail("unexpected request "+method+" "+path);}};
const writer={request:async()=>assert.fail("must never publish candidate")};
const detailPath=()=>"receipts/ai-edit/42/"+run.run_attempt+"/diagnostics.json";
`;
  const result = spawnSync(process.execPath, ["--input-type=module", "-e", source + body], {
    cwd: root,
    encoding: "utf8",
    timeout: 10000,
    maxBuffer: 1000000,
  });
  expect(result.status, result.stderr).toBe(0);
}
describe("complete failure diagnostics", () => {
  it("keeps the bare cause preceding a workflow error marker", () =>
    scenario(String.raw`
    const d=await collectDiagnostics(async()=>"setup ".repeat(2000)+"\nStale source SHA\n##[error]Process completed with exit code 1.");
    assert.ok(d.excerpt.includes("Stale source SHA"));
  `));
  it("invokes the concrete log adapter with exact repository and attempt", () =>
    scenario(String.raw`
    const fs=await import("node:fs/promises"), os=await import("node:os"), path=await import("node:path");
    const dir=await fs.mkdtemp(path.join(os.tmpdir(),"motion5-log-adapter-"));
    const oldPath=process.env.PATH;
    try {
      await fs.writeFile(path.join(dir,"gh"),"#!"+process.execPath+"\nif(process.env.GH_TOKEN !== 'fixture-only') process.exit(3); process.stdout.write(JSON.stringify(process.argv.slice(2)));\n",{mode:0o700});
      process.env.PATH=dir+path.delimiter+oldPath;
      run.run_attempt=7; const concrete=new GitHub(repository,"fixture-only");
      assert.deepEqual(JSON.parse(await concrete.failedLogs(run)),["run","view","42","--repo",repository,"--attempt","7","--log-failed"]);
      await fs.writeFile(path.join(dir,"gh"),"#!"+process.execPath+"\nprocess.stdout.write('not successful logs'); process.exit(1);\n",{mode:0o700});
      await assert.rejects(concrete.failedLogs(run),/Log retrieval failed/);
    } finally {process.env.PATH=oldPath;await fs.rm(dir,{recursive:true,force:true});}
  `));
  it("distinguishes empty logs from unavailable logs", () =>
    scenario(String.raw`
    api.failedLogs=async()=>"";await publishRun(api,writer,run,A);
    const d=JSON.parse(saved.get(detailPath()));assert.equal(d.state,"empty");assert.deepEqual(d.paths,[]);
    assert.ok(comments[0].body.includes("Preparation: **failure**"));
  `));
  it("does not treat a forbidden evidence read as absent history", () =>
    scenario(String.raw`
    api.content=async()=>{const e=new Error("forbidden evidence");e.status=403;throw e;};
    await assert.rejects(publishRun(api,writer,run,A),/forbidden evidence/);
    assert.equal(logCalls,0);assert.equal(saved.size,0);assert.equal(comments.length,0);
  `));
  it("reuses legacy diagnostic metadata without fetching or rewriting", () =>
    scenario(String.raw`
    const bytes=JSON.stringify({state:"available",excerpt:"legacy failure",paths:[]});saved.set(detailPath(),bytes);
    api.failedLogs=async()=>assert.fail("legacy diagnostics refetched");
    await publishRun(api,writer,run,A);await recoverRun(api,run,A);
    assert.equal(saved.get(detailPath()),bytes);assert.ok(comments[0].body.includes("legacy failure"));
  `));
  it("rejects malformed retained diagnostics before reporting", () =>
    scenario(String.raw`
    saved.set(detailPath(),JSON.stringify({state:"available",excerpt:123}));
    await assert.rejects(publishRun(api,writer,run,A),/Invalid retained diagnostics/);
    assert.equal(comments.length,0);
  `));

  it.each(["failure", "cancelled", "timed_out", "skipped"])(
    "retains %s preparation evidence",
    (conclusion) => {
      scenario(
        "run.conclusion=" +
          JSON.stringify(conclusion) +
          ";" +
          String.raw`
await publishRun(api,writer,run,A);assert.equal(logCalls,1,"AI failure bypassed diagnostics");
const d=JSON.parse(saved.get(detailPath()));assert.equal(d.run_conclusion,run.conclusion);assert.equal(d.state,"available");
assert.ok(d.excerpt.includes("Stale source SHA"));assert.ok(comments[0].body.includes("Preparation: **"+run.conclusion+"**"));
assert.ok(comments[0].body.includes("diagnostics.json"));assert.ok(!comments[0].body.includes("<script>")&&!comments[0].body.includes("@everyone"));
assert.ok(![...saved.values()].join("").includes("fixture-sensitive"));assert.ok(!comments[0].body.includes("inspect operation.json"));
assert.equal(JSON.parse(saved.get(value.evidence_path)).publication,"not_attempted");`,
      );
    },
  );
  it("finds plain Error after setup noise", () =>
    scenario(
      String.raw`const d=await collectDiagnostics(async()=>"setup ".repeat(2000)+"\nError: Stale source SHA\n");assert.ok(d.excerpt.includes("Stale source SHA"),"plain error lost behind prefix");`,
    ));
  it("retries unavailable logs and preserves them on recovery", () =>
    scenario(
      String.raw`api.failedLogs=async()=>{logCalls++;throw new Error("transport secret=hidden");};await publishRun(api,writer,run,A);assert.equal(logCalls,3);const bytes=saved.get(detailPath());assert.equal(JSON.parse(bytes).state,"unavailable");api.failedLogs=async()=>assert.fail("refetched evidence");await recoverRun(api,run,A);assert.equal(saved.get(detailPath()),bytes);assert.ok(comments[0].body.includes("unavailable"));`,
    ));
  it("restores details after comment failure", () =>
    scenario(
      String.raw`failComment=true;await assert.rejects(publishRun(api,writer,run,A),/missing/);assert.ok(saved.has(detailPath()),"diagnostics not durable");const before=new Map(saved);failComment=false;api.failedLogs=async()=>assert.fail("refetched evidence");await recoverRun(api,run,A);assert.deepEqual(saved,before);assert.ok(comments[0].body.includes("Stale source SHA"));`,
    ));
  it("independent recovery retains failure reason", () =>
    scenario(
      String.raw`await recoverRun(api,run,A);assert.ok(saved.has(detailPath()),"fallback omitted diagnostics");assert.ok(comments[0].body.includes("Stale source SHA"));`,
    ));
  it("completes legacy receipt without rewriting it", () =>
    scenario(
      String.raw`const bytes=JSON.stringify(value)+"\n";saved.set(value.evidence_path,bytes);await publishRun(api,writer,run,A);assert.equal(saved.get(value.evidence_path),bytes);assert.ok(saved.has(detailPath()),"legacy receipt blocked diagnostics");`,
    ));
  it("propagates a 404 while replaying a confirmed receipt", () =>
    scenario(
      String.raw`run.conclusion="success";currentHead=C;failComment=true;const v=receipt({kind:"ai-edit",repository,run_id:42,run_attempt:1,request_commit:B,source_sha:A,request_digest:"d".repeat(64),phase:"publication",candidate_sha:C,published_sha:C});saved.set(v.evidence_path,JSON.stringify(v)+"\n");await assert.rejects(publishRun(api,writer,run,A),/missing/);`,
    ));
  it("retains stale completion without replacing summary", () =>
    scenario(
      String.raw`currentHead=C;assert.equal((await publishRun(api,writer,run,A)).comment,"stale");assert.ok(saved.has(detailPath()));assert.equal(comments.length,0);`,
    ));
  it("keeps attempts independent and ordering intact", () =>
    scenario(
      String.raw`run.run_attempt=2;await publishRun(api,writer,run,A);const body=comments[0].body;run.run_attempt=1;assert.equal((await publishRun(api,writer,run,A)).comment,"stale");assert.equal(comments[0].body,body);assert.ok(saved.has(detailPath())&&saved.has("receipts/ai-edit/42/2/diagnostics.json"));`,
    ));
  it("propagates persistence failure before commenting", () =>
    scenario(
      String.raw`api.persist=async()=>{throw new Error("evidence write failed");};await assert.rejects(publishRun(api,writer,run,A),/evidence write failed/);assert.equal(comments.length,0);`,
    ));
  it("rejects conflicting retained conclusions", () =>
    scenario(
      String.raw`saved.set(detailPath(),JSON.stringify({state:"available",excerpt:"unrelated",run_conclusion:"success",paths:[]}));await assert.rejects(publishRun(api,writer,run,A),/conclusion/);assert.equal(comments.length,0);`,
    ));
  it("fills missing CI diagnostics beside an existing receipt", () =>
    scenario(
      String.raw`run.path=".github/workflows/ci.yml";const ci=receipt({kind:"ci",repository,run_id:42,run_attempt:1,head_sha:B,tested_sha:B,ci:"failure"});const bytes=JSON.stringify(ci)+"\n";saved.set(ci.evidence_path,bytes);await reportCompletedRun(api,run,A);assert.equal(saved.get(ci.evidence_path),bytes);assert.ok(saved.has("receipts/ci/42/1/diagnostics.json"),"CI receipt blocked diagnostics");assert.ok(comments[0].body.includes("Stale source SHA"));`,
    ));
  it("validates identity before concrete log retrieval", () =>
    scenario(
      String.raw`const concrete=new GitHub(repository,"fixture-only");assert.equal(typeof concrete.failedLogs,"function");await assert.rejects(concrete.failedLogs({...run,repository:{full_name:"other/repo"}}),/Repository mismatch/);`,
    ));
});
