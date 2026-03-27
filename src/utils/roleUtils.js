export function getUserProfile() {
  const stored = localStorage.getItem('userData');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function normalizeRoleName(name) {
  return String(name || '').trim().toLowerCase();
}

// Returns an array of role names (lowercased).
// Supports shapes like:
// - { roles: { name: "HCC Admin" } }
// - { role: { name: "Super Admin" } }
// - { roleName: "Volunteer" }
// - { roles: ["HCC Admin", "HCC Data Entry"] } / { roles: [{name: ...}] }
export function getCurrentUserRoleNames() {
  const profile = getUserProfile();
  if (!profile) return [];

  const names = new Set();

  if (profile.roleName) names.add(normalizeRoleName(profile.roleName));
  if (profile.roles?.name) names.add(normalizeRoleName(profile.roles.name));
  if (profile.role?.name) names.add(normalizeRoleName(profile.role.name));

  const roles = profile.roles;
  if (Array.isArray(roles)) {
    for (const r of roles) {
      if (typeof r === 'string') names.add(normalizeRoleName(r));
      else if (r?.name) names.add(normalizeRoleName(r.name));
    }
  }

  // Some APIs store role name directly as `roles`
  if (typeof roles === 'string') names.add(normalizeRoleName(roles));

  return Array.from(names).filter(Boolean);
}

export function isSuperAdmin() {
  const names = getCurrentUserRoleNames();
  if (names.some((n) => n === 'super admin' || n === 'superadmin')) return true;

  // Fallback: some backends encode Super Admin as roleId 1
  const profile = getUserProfile();
  return String(profile?.roleId || profile?.role_id || '') === '1';
}

export function isHccRole() {
  const names = getCurrentUserRoleNames();
  return names.some((n) => n.includes('hcc'));
}

export function isHccAdmin() {
  const names = getCurrentUserRoleNames();
  return names.some((n) => n === 'hcc admin' || n === 'hccadmin' || n === 'hcc-admin');
}

