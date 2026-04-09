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

function decodeRoleConstant(role) {
  const raw = String(role || '').trim();
  if (!raw) return [];

  // Examples:
  // "ROLE_SUPER_ADMIN" -> ["role_super_admin", "super admin"]
  // "ROLE_HCC_DATA_ENTRY" -> ["role_hcc_data_entry", "hcc data entry"]
  const normalizedRaw = normalizeRoleName(raw);
  if (!normalizedRaw.startsWith('role_')) return [normalizedRaw];

  const decoded = normalizedRaw
    .replace(/^role_/, '')
    .replace(/_/g, ' ')
    .trim();

  return [normalizedRaw, decoded].filter(Boolean);
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
  if (profile.role) {
    for (const r of decodeRoleConstant(profile.role)) names.add(r);
  }
  if (profile.roles?.name) names.add(normalizeRoleName(profile.roles.name));
  if (profile.role?.name) names.add(normalizeRoleName(profile.role.name));

  const roles = profile.roles;
  if (Array.isArray(roles)) {
    for (const r of roles) {
      if (typeof r === 'string') {
        for (const rr of decodeRoleConstant(r)) names.add(rr);
      }
      else if (r?.name) names.add(normalizeRoleName(r.name));
    }
  }

  // Some APIs store role name directly as `roles`
  if (typeof roles === 'string') {
    for (const r of decodeRoleConstant(roles)) names.add(r);
  }

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

export function isHccDataEntry() {
  const names = getCurrentUserRoleNames();
  return names.some((n) =>
    n === 'hcc data entry' ||
    n === 'hcc data-entry' ||
    n === 'hccdataentry'
  );
}

export function isHccSupervisor() {
  const names = getCurrentUserRoleNames();
  return names.some((n) =>
    n === 'hcc supervisor' ||
    n === 'hcc supervisore' ||
    n === 'hcc-supervisor' ||
    n === 'hcc-supervisore' ||
    n === 'hccsupervisor'
  );
}

export function isHccAdvisore() {
  const names = getCurrentUserRoleNames();
  return names.some((n) =>
    n === 'hcc advisore' ||
    n === 'hcc-advisore' ||
    n === 'hccadvisore'
  );
}

