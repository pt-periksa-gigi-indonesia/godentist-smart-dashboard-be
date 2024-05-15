const allRoles = {
  user: ['basic'],
  admin: ['admin', 'basic'],
  master: ['master', 'admin', 'basic'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
