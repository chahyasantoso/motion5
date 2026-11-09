export const cleanFixture = "export const value = 1;";
export const rigEntrypointFixture = "import { readFrame } from '@motion5/rig';";
export const undeclaredSubpathFixture = "import { solveFabrik } from '@motion5/rig/fabrik';";
export const dynamicUndeclaredFixture = 'const rig = import("@motion5/rig/fabrik");';
export const importMentionFixture =
  'const text = "import(\'@motion5/rig/fabrik\')"; // require("@motion5/rig/fabrik") is prose';
