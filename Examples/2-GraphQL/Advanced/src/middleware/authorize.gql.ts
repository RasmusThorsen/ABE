import { AuthChecker } from "type-graphql";
  
export const authChecker: AuthChecker<any> = ({ context: { user } }, roles) => {
    if (roles.length === 0) {
      // if `@Authorized()`, check only if user exists
      return user !== undefined;
    }
    // there are some roles defined now
  
    if (!user) {
      // and if no user, restrict access
      return false;
    }
    // if (user.role.some((role: string) => roles.includes(role))) {
    if(roles.includes(user.role)) {
      // grant access if the roles overlap
      return true;
    }
  
    // no roles matched, restrict access
    return false;
  };