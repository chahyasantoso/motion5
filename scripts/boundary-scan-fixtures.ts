export const cleanFixture = "export const value = 1;";
export const rigEntrypointFixture = "import { readFrame } from '@gerak/rig';";
export const undeclaredSubpathFixture = "import { solveFabrik } from '@gerak/rig/fabrik';";
export const dynamicUndeclaredFixture = 'const rig = import("@gerak/rig/fabrik");';
export const importMentionFixture =
  'const text = "import(\'@gerak/rig/fabrik\')"; // require("@gerak/rig/fabrik") is prose';
export const packageImportsAppFixture = "import { main } from '../../../apps/demo/src/main';";
export const appImportsPackagePathFixture =
  "import { hop } from '../../../packages/moves/src/pose';";
export const appImportsAppFixture = "import { other } from '../../other/src/main';";
