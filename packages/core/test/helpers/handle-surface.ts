import { expect } from "vitest";

/**
 * One owner for what members a handle exposes, and for how one of them is touched.
 *
 * Six test files read a handle's surface directly, and every one of them reads it as own enumerable
 * keys: `Object.keys(handle)` for the whole surface in `SH-1` and `RA-32`, the same call for one
 * declared member in four `declaring` copies, and `Object.getOwnPropertyDescriptor(handle, member)`
 * for the read or the call itself in two byte-identical `touch` copies. That is a fact about how
 * `ProjectRuntime` builds a handle rather than a fact about what a handle is: both factories answer a
 * frozen object literal, so every member is an own enumerable property of it.
 *
 * Issue #443's step 8 converts both factories to classes over one ref, which makes
 * `Object.keys(handle)` empty and `Object.getOwnPropertyDescriptor(handle, member)` answer nothing
 * without moving one member, one signature or one refusal. So what a handle exposes is a decision,
 * and the change that moves it should be the change that says so. This module is the honest first
 * half of it: every reader asks one question through one owner, that owner walks the prototype chain
 * as well as the instance, and it answers the same surface on both sides of that conversion.
 *
 * What moves is the reader and not the list. Which members a case is about, and which arguments each
 * of them needs, stay with the case that claims it, because the coverage checks in `SH-1` and `RA-32`
 * are derived from those lists against the surface below. See ADR-056 and ADR-061.
 */

/**
 * Every object a handle's members can be declared on: the instance, then its prototypes.
 *
 * `Object.prototype` is where the walk stops, so an inherited `toString` is not a handle member. A
 * frozen literal's prototype is that object, which is why one walk answers the instance alone for the
 * shape shipped today and one prototype more for a class.
 */
function chain(handle: object): readonly object[] {
  const links: object[] = [];
  let link: object | null = handle;
  while (link !== null && link !== Object.prototype) {
    links.push(link);
    link = Object.getPrototypeOf(link) as object | null;
  }
  return links;
}

/**
 * Every member this handle exposes, own properties first and each named once.
 *
 * Enumerability is deliberately not asked, and `constructor` is deliberately not reported. A
 * literal's members are all enumerable and a class's prototype members are none of them, so a reader
 * that filtered on it would answer the whole surface on one side of the conversion and nothing at all
 * on the other; and a class body declares a `constructor` whether it writes one or not, which is part
 * of no surface either factory declares.
 */
export function handleMembers(handle: object): readonly string[] {
  const members = new Set<string>();
  for (const link of chain(handle))
    for (const name of Object.getOwnPropertyNames(link))
      if (name !== "constructor") members.add(name);
  return [...members];
}

/**
 * Asserts this handle exposes every member named, and answers it so a case can keep reading.
 *
 * Collected rather than asserted one at a time, on the rule the coverage cases already follow: a red
 * run names every member that was missing rather than the first one.
 */
export function declaresMembers<H extends object>(handle: H, ...members: readonly string[]): H {
  const exposed = handleMembers(handle);
  expect(members.filter((member) => !exposed.includes(member))).toEqual([]);
  return handle;
}

/** One member's own descriptor, found wherever on the chain that member is declared. */
function descriptorOf(handle: object, member: string): PropertyDescriptor {
  for (const link of chain(handle)) {
    const descriptor = Object.getOwnPropertyDescriptor(link, member);
    if (descriptor !== undefined) return descriptor;
  }
  throw new Error(`No handle member named "${member}".`);
}

/**
 * Reads one member through its own descriptor, so a getter is touched as a read and a method as a
 * call, with the handle as the receiver either way.
 *
 * Answered as a thunk rather than performed, which is the whole reason a descriptor is read at all:
 * `typeof handle.definition` cannot be asked of a stale handle, because that read is itself the
 * refusal being measured, so it has to be deferred to be classified.
 */
export function touchMember(
  handle: object,
  member: string,
  args: readonly unknown[] = [],
): () => unknown {
  const descriptor = descriptorOf(handle, member);
  const read = descriptor.get;
  if (read !== undefined) return () => read.call(handle);
  const call = descriptor.value as (...rest: unknown[]) => unknown;
  return () => call.apply(handle, [...args]);
}
