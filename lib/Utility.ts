/**
 * Created by tushar on 25/10/17.
 */

export const fileName = (hash: string) => hash.slice(2)
export const dirName = (hash: string) => hash.slice(0, 2)
