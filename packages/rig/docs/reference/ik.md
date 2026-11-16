# @gerak/rig: ik

- **`SolveQuality`** `type SolveQuality`: How well rotations met the goal: one flat union over both strategies. Residual is distance left; kind says why.
- **`SolveResult`** `type SolveResult`: One IK solve answer, same shape every strategy: rotations plus quality.
- **`UNBOUND_POLE3D`** `const UNBOUND_POLE3D: Pole3d`: Solve with no pole bound; shared, not allocated per solve.
- **`Pole3d`** `type Pole3d`: Authored bend control: `unbound` keeps the root-local +z rule; `point` is the world position the elbow bends toward, with the bend plane through pivot, goal and pole.
- **`ChainMember3d`** `type ChainMember3d`: One member of a 3D solver chain, as both 3D strategies read it. `base` names parent or root; `limit`, `influence`, `orient`, `goal` only where authored; absent = free or unpulled.
- **`FREE_JOINT3D`** `const FREE_JOINT3D: JointLimit3d`: The joint limit that constrains nothing; shared, not allocated per read.
- **`JointLimit3d`** `type JointLimit3d`: Sole owner of 3D joint limits: the legal local orientation, relative to the parent's solved frame, nearest the one the solve proposes.
- **`chainShape3d`** `(members: readonly ChainMember3d[]): ChainShape3d`: Chain shape, or a throw when no member carries a goal. Order: goal guard → `constrained` → `two-bone` pair → `tree`.
- **`solveChain3d`** `(root: WorldFrame3d, members: readonly ChainMember3d[], bend?: Pole3d): SolveResult3d`: Solves one 3D chain: position by shape, then each oriented leaf toward its goal. Orientation turns leaves without moving the tip, so position keeps priority.
- **`ChainShape3d`** `type ChainShape3d`: Strategy answering one 3D chain; derived at solve time, never authored. `two-bone` carries pair + goal, `tree` members, `constrained` members with a limiting joint.
