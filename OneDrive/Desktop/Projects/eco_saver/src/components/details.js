// Details.js
import React from 'react';
import { connect } from 'react-redux';

function Details(props) {
  const { targetAmount, inputs } = props;

  return (
    <div className="container mt-4">
      <h2>Details:</h2>
      <p>Target Amount: {targetAmount}</p>
      <p>Inputs:</p>
      <ul>
        {inputs.map((input, index) => (
          <li key={index}>
            <strong>Input {index + 1}:</strong>
            <ul>
              <li>Value: {input.value}</li>
              <li>Current: {input.current}</li>
              <li>Power: {input.power}</li>
              <li>Power Factor: {input.powerFactor}</li>
              <li>Voltage: {input.voltage}</li>
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

const mapStateToProps = (state) => ({
  targetAmount: state.targetAmount,
  inputs: state.inputs,
});

export default connect(mapStateToProps)(Details);
