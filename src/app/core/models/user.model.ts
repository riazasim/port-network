export interface UserModel {
    userId?: number;
    user:{
        email?: string;
        roles:  [];
        userRole?: string;
        status: Boolean;
    },
    userSetting:{
        timezone?: string;
        firstName: string;
        lastName: string;
        language: "EN" | "RO";
        phone: string;
        phoneRegionCode: string;
        department: string;
    }

}

export interface UserTable {
    items: UserModel[];
    noFiltered: number;
    noTotal: number;
}
