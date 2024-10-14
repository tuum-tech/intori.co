export const isSuperAdmin = (fid: number): boolean => {
  const superFids = (process.env.SUPER_ADMIN_FIDS || '').split(',').map((fid) => parseInt(fid, 10))

  return superFids.includes(fid)
}
