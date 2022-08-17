export default async function promisifyForLoopAsync<T>(
  iterable: Array<T>,
  asyncfunc_: (context: T) => Promise<any>
) {
  return await Promise.all(
    iterable.map(async (item) => {
      return await asyncfunc_(item);
    })
  );
}
