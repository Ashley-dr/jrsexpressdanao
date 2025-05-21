/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

function RateCalculator({ currentAuth }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [containerType, setContainerType] = useState("");
  const [isExpress, setIsExpress] = useState(false);
  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [actualWeight, setActualWeight] = useState(0);
  const [hasInsurance, setHasInsurance] = useState(false);
  const [hasValuation, setHasValuation] = useState(false);
  const [value, setValue] = useState(0);
  const [locations, setLocations] = useState([]);
  const [containerTypes, setContainerTypes] = useState([]);
  const [calculatedResult, setCalculatedResult] = useState(null);

  useEffect(() => {
    const danaoCityLocations = [
      "Barangay Suba",
      "Barangay Taboc",
      "Barangay Mantuyong",
      "Barangay Looc",
      "Barangay Poblacion",
      "Barangay Guinacot",
      "Barangay Maslog",
      "Barangay Cabungahan",
      "Barangay Sandayong Norte",
      "Barangay Sandayong Sur",
      "Barangay Langtad",
      "Barangay Cahumayan",
      "Barangay Cagatohan",
      "Barangay Danasan",
      "Barangay Santa Rosa",
      "Barangay Dunga",
      "Barangay Dungguan",
      "Barangay Fuga",
      "Barangay Guinsay",
      "Barangay Lawaan",
      "Barangay Licos",
      "Barangay Magtagobtob",
      "Barangay Malapoc",
      "Barangay Manlayag",
      "Barangay Pili",
      "Barangay Sabang",
      "Barangay Sacsac",
      "Barangay Simala",
      "Barangay Taytay",
    ];
    setLocations(danaoCityLocations);
    setContainerTypes([
      { value: "Documents", label: "Documents" },
      { value: "Pouch", label: "Pouch" },
      { value: "Box", label: "Box" },
      { value: "Cargo", label: "Cargo" },
    ]);
  }, []);

  const calculateShippingRate = () => {
    const volume = (length * width * height) / 3500; // volumetric weight (kg)
    const chargeableWeight = Math.max(volume, actualWeight / 1000); // in kg

    let baseRate = 182; // base rate for same location
    if (from !== to) baseRate += 35; // extra for different location

    switch (containerType) {
      case "Pouch":
        baseRate += 10;
        break;
      case "Box":
        baseRate += 20;
        break;
      case "Cargo":
        baseRate += 50;
        break;
      default:
        break;
    }

    // Add weight charge
    let weightCharge = chargeableWeight * 20;

    // Express delivery surcharge
    const expressCharge = isExpress ? 40 : 0;

    // Insurance
    const insuranceCharge = hasInsurance ? 25 : 0;

    // Valuation
    const valuationCharge = hasValuation ? value * 0.01 : 0;

    const totalPrice =
      baseRate +
      weightCharge +
      expressCharge +
      insuranceCharge +
      valuationCharge;

    const result = {
      from,
      to,
      containerType,
      isExpress,
      dimensions: { length, width, height },
      actualWeight,
      chargeableWeight,
      hasInsurance,
      hasValuation,
      value,
      totalPrice: totalPrice.toFixed(2),
    };

    setCalculatedResult(result);
  };

  return (
    <div className="calculator-container justify-self-center mb-10">
      <div className="section location">
        <h3>Tells us about the location.</h3>
        <div className="input-group">
          <label>From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)}>
            <option value="">Select location</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)}>
            <option value="">Select location</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="section container-details">
        <h3>Container Type</h3>
        <div className="input-group">
          <label>Container Type</label>
          <select
            value={containerType}
            onChange={(e) => setContainerType(e.target.value)}
          >
            <option value="">Select type</option>
            {containerTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div className="express-checkbox">
          <label htmlFor="express">Express</label>
          <input
            type="checkbox"
            id="express"
            checked={isExpress}
            onChange={(e) => setIsExpress(e.target.checked)}
          />
        </div>
        <div className="dimensions">
          <div className="input-group">
            <label>Length (cm)</label>
            <input
              type="number"
              value={length}
              onChange={(e) => setLength(+e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Width (cm)</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(+e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(+e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="section weight">
        <h3>Actual Weight</h3>
        <div className="input-group">
          <label>Actual Weight (grams)</label>
          <input
            type="number"
            value={actualWeight}
            onChange={(e) => setActualWeight(+e.target.value)}
          />
        </div>
      </div>

      <div className="section additional-charges">
        <h3>Additional charges.</h3>
        <div className="checkbox-group">
          <input
            type="checkbox"
            checked={hasInsurance}
            onChange={(e) => setHasInsurance(e.target.checked)}
          />
          <label>Insurance</label>
        </div>
        <div className="checkbox-group">
          <input
            type="checkbox"
            checked={hasValuation}
            onChange={(e) => setHasValuation(e.target.checked)}
          />
          <label>Valuation</label>
        </div>
        <div className="input-group value-input">
          <label>Item Value (₱)</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(+e.target.value)}
          />
        </div>
      </div>

      <button className="calculate-button" onClick={calculateShippingRate}>
        CALCULATE RATE
      </button>

      {calculatedResult && (
        <div className="result-display">
          <h4>Calculation Result:</h4>
          <ul>
            <li>
              <strong>From:</strong> {calculatedResult.from}
            </li>
            <li>
              <strong>To:</strong> {calculatedResult.to}
            </li>
            <li>
              <strong>Container:</strong> {calculatedResult.containerType}
            </li>
            <li>
              <strong>Express:</strong>{" "}
              {calculatedResult.isExpress ? "Yes" : "No"}
            </li>
            <li>
              <strong>Dimensions:</strong> {calculatedResult.dimensions.length}{" "}
              x {calculatedResult.dimensions.width} x{" "}
              {calculatedResult.dimensions.height} cm
            </li>
            <li>
              <strong>Weight:</strong> {calculatedResult.actualWeight} g
            </li>
            <li>
              <strong>Chargeable Weight:</strong>{" "}
              {calculatedResult.chargeableWeight.toFixed(2)} kg
            </li>
            <li>
              <strong>Insurance:</strong>{" "}
              {calculatedResult.hasInsurance ? "Yes" : "No"}
            </li>
            <li>
              <strong>Valuation:</strong>{" "}
              {calculatedResult.hasValuation ? `Yes (₱${value})` : "No"}
            </li>
            <li>
              <strong>Total Price:</strong> ₱{calculatedResult.totalPrice}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default RateCalculator;
