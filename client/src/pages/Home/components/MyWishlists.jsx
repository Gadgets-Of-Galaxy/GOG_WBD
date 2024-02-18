import {UserNavLinks} from "./UserNavLinks";
import "../styles/Wishlist.css"
import {WishlistComponent} from "./WishlistComponent";

export const MyWishlists = () => {
    return (
        <div className="myAccount">
            <UserNavLinks activeLink="Wishlist"/>
            <WishlistComponent/>
        </div>
    );
}