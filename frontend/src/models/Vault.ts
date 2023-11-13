import { PasswordAccount } from "./Account";
import { Tag } from "./Tag";
import { PasswordClassic } from "./Classic";
import {User} from "./User";
export interface Vault {
    id: number;
    created_at: string;
    last_modified: string;
    title: string;
    description: string;
    master_password: string;
    account_passwords: PasswordAccount[];
    classic_passwords: PasswordClassic[];
    tags: Tag[];
    nb_acc: number;
    user: User|number;
}