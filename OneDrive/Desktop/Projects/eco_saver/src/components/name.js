// Name.js
import React from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './name.css';
const Name = (props) => {
    let i=[1,2,3,4,5];
    const[show,setShow]=React.useState(false);
    const navigate = useNavigate();
  const { inputs, targetAmount, dispatch } = props;
  const n = 2;

  const handleChange = (index, value) => {
    const updatedInputs = [...inputs];
    updatedInputs[index] = { ...updatedInputs[index], value };
    dispatch({ type: 'UPDATE_INPUTS', payload: updatedInputs });
  };

  const handleTargetChange = (e) => {
    dispatch({ type: 'UPDATE_TARGET_AMOUNT', payload: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Additional logic, if needed
    // For example: setShowTargetInput(true);
  };

  const handleFinalSubmit = async () => {
    try {
      // Fetch data from Flask endpoint
      const response = await fetch('http://192.168.172.157:5000/get_data');
      const data = await response.json();

      // Create an array to store unique values for each array in inputs
      const currentArray = inputs.map((item, index) => ({
        current: data[`sensor${index + 1}_value`],
        power: data[`sensor${index + 1}_value`]*180,
        powerFactor: 0.8,
        voltage: 230,
      }));

      // Create an object with all values, including unique values for each array
      const formData = {
        inputs: inputs.map((item, index) => ({
          ...item,
          ...currentArray[index], // Merge unique values for the current array
        })),
        targetAmount: targetAmount,
      };

      dispatch({ type: 'UPDATE_INPUTS', payload: formData.inputs });
      dispatch({ type: 'UPDATE_TARGET_AMOUNT', payload: formData.targetAmount });

      // Perform any action with the form data
      console.log('All Values:', formData);
      navigate('/home');
      // Additional logic, if needed
      // For example: Reset the form, navigate to another page, etc.
    } catch (error) {
      console.error('Error fetching data from Flask endpoint:', error);
    }
  };
  function appear(){
    setShow(true);
  }

  return (
    <div className="container mt-4">
      <h2>Let's Do the small setup</h2>
      <form onSubmit={handleSubmit} className={show ? 'd-none' : 'form-input'}>
        {[...Array(n)].map((_, index) => (
          <div key={index}>
            <label htmlFor={`input-${index + 1}`} className="form-label">
              Switch {index + 1}
            </label>
            <input
              type="text"
              className="form-control"
              id={`input-${index + 1}`}
              placeholder={`Enter the switch ${index+1} connected appliance`}
              value={inputs[index]?.value || ''}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          </div>
        ))}
        <center>
        <button type="submit" className="btn btn-primary mt-3" onClick={appear}>
          Submit
        </button>
        </center>
      </form>

      {show && <div className="mt-4 target">
        <label htmlFor="targetAmount" className="form-label">
          Target Amount
        </label>
        <p>Specify your electricity bill goal amount. We offer a comprehensive and concise plan to help you achieve this target.</p>
        <input
          type="text"
          className="form-control"
          id="targetAmount"
          value={targetAmount}
          onChange={handleTargetChange}
        />
        <center>
        <button
          type="button"
          className="btn btn-success mt-3"
          onClick={handleFinalSubmit}
        >
          Save
        </button>
        </center>
      </div>}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    inputs: state.inputs,
    targetAmount: state.targetAmount,
  };
};

export default connect(mapStateToProps)(Name);
