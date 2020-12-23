import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Account } from '../models/account';
import * as AccountActions from './account.actions';

export const accountsFeatureKey = 'accounts';

export interface AccountState extends EntityState<Account> {
  // additional entities state properties
  error: any;
  selectedAccount: Account;
}

export const adapter: EntityAdapter<Account> = createEntityAdapter<Account>();

export const initialState: AccountState = adapter.getInitialState({
  // additional entity state properties
  error: undefined,
  selectedAccount: undefined
});


export const accountReducer = createReducer(
  initialState,
  // ---- ADD ----
  on(AccountActions.AddAccountSuccess,
    (state, action) => 
      adapter.addOne<AccountState>(action.account, state)
  ),
  on(AccountActions.AddAccountFailure,
    (state, action) => ({...state, error: action.error})    
  ),
  // ---- LOAD ----  Accounts[]
  on(AccountActions.loadAccountsSuccess,
    (state, action) => 
      adapter.setAll<AccountState>(action.accounts, state)
  ),
  on(AccountActions.loadAccountsFailure,
    (state, action) => ({...state, error: action.error})   
  ),
  // ---- LOAD ----  Account
  on(AccountActions.loadAccountSuccess,
    (state, action) => ({
      ...state,
      selectedAccount: action.selectedAccount
    })
  ),
  on(AccountActions.loadAccountsFailure,
    (state, action) => ({...state, error: action.error})   
  ),
  
  // ---- EDIT ----  
  on(AccountActions.updateAccount,
    (state, action) => 
      adapter.updateOne<AccountState>(action.account, state)
  ),
  
  // ---- OTHER ---- 
  on(AccountActions.updateAccounts,
    (state, action) => adapter.updateMany(action.accounts, state)
  ),
  on(AccountActions.deleteAccount,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(AccountActions.deleteAccounts,
    (state, action) => adapter.removeMany(action.ids, state)
  )
);

export function reducer(state: AccountState | undefined, action: Action) {
  return accountReducer(state, action);
  }



export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();