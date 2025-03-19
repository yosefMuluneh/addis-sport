export interface Admin {
    id: string;
    username: string;
    password: string;
    role: "admin" | "user";
  }
  
  export const admins: Admin[] = [
    { id: "1", username: "admin", password: "admin123", role: "admin" },
    { id: "2", username: "user", password: "user123", role: "user" },
  ];
  
  export function addAdmin(admin: Omit<Admin, "id" | "role">) {
    const newAdmin = { id: `${admins.length + 1}`, role: "admin" as const, ...admin };
    admins.push(newAdmin);
    console.log("Admin added:", newAdmin);
    console.log("Current admins array:", admins);
    return newAdmin;
  }
  
  export function getAdmins() {
    console.log("Admins retrieved:", admins);
    return admins;
  }