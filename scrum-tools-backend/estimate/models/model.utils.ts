import { EstimationMember, EstimationSession } from './estimation-models';

export function clearMember(member: EstimationMember): EstimationMember {
  return { ...member, secret: null };
}

export function clearSession(session: EstimationSession, isAdmin = false): EstimationSession {
  if (!isAdmin) {
    return { ...session, adminSecret: null };
  } else {
    return session;
  }
}
