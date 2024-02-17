import "../styles/addProductPopUp.css";
import { useState, useEffect } from "react";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
console.log("popup");

export const AddProductPopUp = ({onClose}) => {

  <div className="popup">
    <div className="popup-content">
      <div className="popup-header">
        <h1>
          Hire <span className="orange-text">Talent</span>
        </h1>
        <button className="close-button-popup" onClick={onClose}>
          X
        </button>
      </div>
    </div>
  </div>;
};
