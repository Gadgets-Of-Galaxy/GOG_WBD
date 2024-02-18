import { UserNavLinks } from "./UserNavLinks";
import { EditProfileComponent } from "./EditProfileComponent";
import "../styles/MyAccount.css"

export const EditProfile = () => {
    return (
        <div className="myAccount">
            <UserNavLinks activeLink="EditProfile" />
            <EditProfileComponent/>
        </div>
    );
}