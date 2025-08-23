import { OperationStatus, ErrorType } from '../base/status';
import { UserProfile } from '@/data/models/user';

export type Member = UserProfile;

export interface SearchMembersRequest {
  query: string;
}

export interface SearchMembersResponse {
  status: OperationStatus;
  data: Member[] | null;
  errorType?: ErrorType;
  message?: string;
}

export interface GetMemberByEmailRequest {
  email: string;
}

export interface GetMemberByEmailResponse {
  status: OperationStatus;
  data: Member | null;
  errorType?: ErrorType;
  message?: string;
}


