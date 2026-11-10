export const cleanFixture = "export const value = 1;";
export const rigEntrypointFixture = "import { readFrame } from '@gerak/rig';";
export const undeclaredSubpathFixture = "import { solveFabrik } from '@gerak/rig/fabrik';";
export const dynamicUndeclaredFixture = 'const rig = import("@gerak/rig/fabrik");';
export const importMentionFixture =
  'const text = "import(\'@gerak/rig/fabrik\')"; // require("@gerak/rig/fabrik") is prose';
