import { EstimationMember, EstimationSession, TopicVote } from './estimation-models';

export function clearMember(member: EstimationMember): EstimationMember {
  return { ...member, secret: null };
}

export function clearVote(vote: TopicVote): TopicVote {
  return { ...vote, vote: null };
}

export function clearSession(session: EstimationSession, isAdmin = false): EstimationSession {
  console.log('clearSession', isAdmin, session);
  if (!session.adminSecret) {
    console.error(new Error('admin secret not found'));
  }
  if (!isAdmin) {
    return { ...session, adminSecret: null };
  } else {
    return session;
  }
}
