import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as solidStar,
  faStarHalfAlt as halfStar,
  faCartShopping,
  faHeart,
  faShare,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import {
  faFacebook,
  faTelegram,
  faTwitter,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { Header } from "../../CommonComponents/components/Header";
import "../styles/ProductDetailsPage.css";

function openPopup() {
  const popupContainer = document.getElementById('popupContainer');
  popupContainer.style.display = 'block';

  // Automatically close the popup after the specified duration
  setTimeout(() => {
    closePopup();
  }, 2000);
}

// Function to close the popup
function closePopup() {
  const popupContainer = document.getElementById('popupContainer');
  popupContainer.style.display = 'none';
}

// Function to generate star icons based on rating
function renderRatingStars(rating) {
  const maxRating = 5;
  const stars = [];
  const solidStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 1; i <= maxRating; i++) {
    if (i <= solidStars) {
      stars.push(
        <FontAwesomeIcon key={i} icon={solidStar} className="solid-star" />
      );
    } else if (hasHalfStar && i === solidStars + 1) {
      stars.push(
        <FontAwesomeIcon key={i} icon={halfStar} className="half-star" />
      );
    } else {
      stars.push(
        <FontAwesomeIcon key={i} icon={regularStar} className="regular-star" />
      );
    }
  }
  return stars;
}

const ProductDetailsPage = () => {
  const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const [user, setUser] = useState(storedUser || null);

  useEffect(() => {
      const fetchUser = async () => {
          try {
              const response = await axios.get('http://localhost:5000/api/users/' + user._id);
              setUser(response.data);
          } catch (error) {
              console.error('Error fetching user:', error);
          }
      };
      if (user) {
          fetchUser();
      }
  }, [user]);

  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [review, setReview] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${productId}`
        );
        setProduct(response.data.product);
        setCurrentImage(response.data.product.imagePath);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/reviews`
        );
        const allReviews = response.data.reviews;
        const filteredReviews = allReviews.filter(review => review.product === productId);
        setReview(filteredReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleThumbnailClick = (imagePath) => {
    setCurrentImage(imagePath);
  };
  
  const addToCart = async (item) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/carts/addToCart`,
        {
          productId: item._id,
          userId: user._id,
        }
      );
      if (response.status === 200) {
        window.alert("Product added to cart successfully");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const toggleShareDropdown = () => {
    setShowShareDropdown(!showShareDropdown);
  };

  const shareToGmail = () => {
    const url = `mailto:?subject=${encodeURIComponent(
      product.title
    )}&body=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank");
  };

  const shareToWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      product.title
    )}: ${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank");
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      window.location.href
    )}`;
    window.open(url, "_blank");
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      window.location.href
    )}&text=${encodeURIComponent(product.title)}`;
    window.open(url, "_blank");
  };

  const shareToTelegram = () => {
    const url = `https://telegram.me/share/url?url=${encodeURIComponent(
      window.location.href
    )}&text=${encodeURIComponent(product.title)}`;
    window.open(url, "_blank");
  };

  const submitReview = async () => {
    const pobj = {
      productId,
      userId: user._id,
      username: user.name,
      rating,
      reviewText
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/reviews`, pobj);
      openPopup();
      window.location.reload();

      if (response.status === 200) {
        alert('Review submitted successfully');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div>
      {/* <Header user={user} /> */}
      {product && (
        <div className="crd-wrpr">
          <div className="crd">
            <div className="prd-imgs">
              <div className="img-dsply">
                <img src={`/${currentImage}`} alt="" />
              </div>
              <div className="img-shwcse">
                <img
                  src={`/${product.imagePath}`}
                  alt=""
                  onClick={() => handleThumbnailClick(product.imagePath)}
                />
                <img
                  src={`/${product.imagethumbnail1}`}
                  alt=""
                  onClick={() => handleThumbnailClick(product.imagethumbnail1)}
                />
                <img
                  src={`/${product.imagethumbnail2}`}
                  alt=""
                  onClick={() => handleThumbnailClick(product.imagethumbnail2)}
                />
                <img
                  src={`/${product.imagethumbnail3}`}
                  alt=""
                  onClick={() => handleThumbnailClick(product.imagethumbnail3)}
                />
              </div>
            </div>
            <div className="prd-ctnt">
              <h3 className="prd-ttl">{product.title}</h3>
              <div className="prd-rating">
                <div className="rating-stars">
                  <p>
                    {renderRatingStars(product.rating)} ({product.rating})
                  </p>
                </div>
              </div>
              <div>
                <div className="prd-price">
                  <p className="lst-prc">
                    INR.{product.price}
                    <span>INR.{product.mrp}</span>
                  </p>
                </div>
                <div className="prd-dtl">
                  <h2>About this item:</h2>
                  <p>{product.description}</p>
                  <h2 className="feauters">Feauters</h2>
                  <ul>
                    <li>{product.features1}</li>
                    <li>{product.features2}</li>
                    <li>{product.features3}</li>
                    <li>{product.features4}</li>
                  </ul>
                </div>
                <div className="pchs-info">
                  <button
                    className="add-wshlst-btn"
                    id="addtocart"
                    data-product-id-w={product._id}
                  >
                    <FontAwesomeIcon
                      className="heart-icon-single"
                      icon={faHeart}
                    />
                    Add to Wishlist
                  </button>
                  <button
                    className="add-cr-btn"
                    id="addtowishlist"
                    data-product-id-c={product._id}
                    onClick={() => addToCart(product)}
                  >
                    <FontAwesomeIcon
                      className="cart-icon-single"
                      icon={faCartShopping}
                    />
                    Add to Cart
                  </button>
                  <div className="share-dropdown">
                    <button
                      className="sharre-btn"
                      onClick={toggleShareDropdown}
                    >
                      <FontAwesomeIcon icon={faShare} size="2x" />
                    </button>
                    {showShareDropdown && (
                      <div className="share-dropdown-content">
                        <button className="share-btn" onClick={shareToGmail}>
                          <FontAwesomeIcon icon={faEnvelope} size="2x" />
                        </button>
                        <button
                          className="share-btn"
                          id="whatsapp"
                          onClick={shareToWhatsApp}
                          icon={faCartShopping}
                        >
                          <FontAwesomeIcon icon={faWhatsapp} size="2x" />
                        </button>
                        <button className="share-btn" onClick={shareToFacebook}>
                          <FontAwesomeIcon icon={faFacebook} size="2x" />
                        </button>
                        <button className="share-btn" onClick={shareToTwitter}>
                          <FontAwesomeIcon icon={faTwitter} size="2x" />{" "}
                        </button>
                        <button className="share-btn" onClick={shareToTelegram}>
                          <FontAwesomeIcon icon={faTelegram} size="2x" />{" "}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="review-section">
            <h2>Reviews</h2>
            <div className="previous-reviews">
              {review && review.map((review, index) => (
                <div key={index} className="review">
                  <p>
                    <strong>{review.username}</strong>
                  </p>
                  <p>Rating: {renderRatingStars(review.rating)}</p>
                  <p>{review.reviewText}</p>
                </div>
              ))}
            </div>
            {user && (
              <div className="review-form">
                <h3>Write a Review</h3>
                <div className="rating-input">
                  <label htmlFor="rating">Rating:</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  />
                </div>
                <div className="review-text-input">
                  <label htmlFor="reviewText">Review:</label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  ></textarea>
                </div>
                <button className="submit-review-btn" onClick={submitReview}>
                  Submit Review
                </button>
              </div>
            )}
          </div>
          <div className="popup-container" id="popupContainer">
            <div className="popup-content">
              <span className="close-btn" onClick={closePopup}>&times;</span>
              <h2>Success!</h2>
              <p>Your review has been submitted successfully.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
