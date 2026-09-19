import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getPermissionsByRole } from '../Services/roleandpermissionService';

const PermissionContext = createContext();

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within PermissionProvider');
  }
  return context;
};

// Export individual hooks for better DX
export const useCanRead = (resource) => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('useCanRead must be used within PermissionProvider');
  }
  return context.canRead(resource);
};

export const useCanCreate = (resource) => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('useCanCreate must be used within PermissionProvider');
  }
  return context.canCreate(resource);
};

export const useCanUpdate = (resource) => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('useCanUpdate must be used within PermissionProvider');
  }
  return context.canUpdate(resource);
};

export const useCanDelete = (resource) => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('useCanDelete must be used within PermissionProvider');
  }
  return context.canDelete(resource);
};

export const PermissionProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load permissions from cookies on mount and fetch from API if user is logged in
  useEffect(() => {
    const loadPermissions = async () => {
      // First load from cookies for immediate availability
      const storedPermissions = Cookies.get('userPermissions');
      if (storedPermissions) {
        try {
          setPermissions(JSON.parse(storedPermissions));
        } catch (error) {
          console.error('Error parsing stored permissions:', error);
        }
      }

      // Check if user is logged in and fetch fresh permissions from API
      const accessToken = Cookies.get('accessToken');
      const activeRoleId = Cookies.get('activeRoleId');
      
      if (accessToken && activeRoleId) {
        try {
          await fetchUserPermissions(activeRoleId);
        } catch (error) {
          console.error('Error fetching permissions on mount:', error);
          // If API call fails, keep using cached permissions from cookies
        }
      }
    };

    loadPermissions();
  }, []);

  const fetchUserPermissions = async (roleId) => {
    if (!roleId) {
      console.error('No roleId provided for fetching permissions');
      return;
    }

    setLoading(true);
    try {
      const permissionsData = await getPermissionsByRole(roleId);
      setPermissions(permissionsData);
      
      // Store permissions in cookies
      Cookies.set('userPermissions', JSON.stringify(permissionsData), { expires: 7 });
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get all permissions as a flat array for easier checking
  const getFlatPermissions = () => {
    if (!permissions || permissions.length === 0) return [];
    
    const flatPermissions = [];
    permissions.forEach(resourceGroup => {
      if (resourceGroup.permissions && Array.isArray(resourceGroup.permissions)) {
        resourceGroup.permissions.forEach(permission => {
          flatPermissions.push({
            ...permission,
            resource: resourceGroup.resource
          });
        });
      }
    });
    return flatPermissions;
  };

  // Permission checking functions
  const canRead = (resource) => {
    return checkPermission('read', resource);
  };

  const canCreate = (resource) => {
    return checkPermission('create', resource);
  };

  const canUpdate = (resource) => {
    return checkPermission('update', resource);
  };

  const canDelete = (resource) => {
    return checkPermission('delete', resource);
  };

  const checkPermission = (action, resource) => {
    if (!permissions || permissions.length === 0) return false;
    
    const flatPermissions = getFlatPermissions();
    
    // Check if user has the specific permission with granted = true
    return flatPermissions.some(perm => 
      perm.granted === true && 
      perm.action === action && 
      perm.resource === resource
    );
  };

  // Generic permission check for any action and resource
  const hasPermission = (action, resource) => {
    return checkPermission(action, resource);
  };

  // Check if user has any permission for a specific resource
  const hasAnyPermissionForResource = (resource) => {
    if (!permissions || permissions.length === 0) return false;
    
    const flatPermissions = getFlatPermissions();
    return flatPermissions.some(perm => 
      perm.granted === true && 
      perm.resource === resource
    );
  };

  const clearPermissions = () => {
    setPermissions([]);
    Cookies.remove('userPermissions');
  };

  return (
    <PermissionContext.Provider value={{ 
      permissions, 
      loading, 
      fetchUserPermissions,
      getFlatPermissions,
      canRead, 
      canCreate, 
      canUpdate, 
      canDelete,
      hasPermission,
      hasAnyPermissionForResource,
      clearPermissions
    }}>
      {children}
    </PermissionContext.Provider>
  );
};
