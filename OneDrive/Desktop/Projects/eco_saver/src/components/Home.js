// HomePage.js
import React from 'react';
import { connect } from 'react-redux';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbot from './Nav3';
var practicalPrice=0;
var practicalUnit=0;
var usageUnit=0;
var usagePrice=0;
function Home(props) {
  const { targetAmount, inputs } = props;
  const dataArray = [];
  const electricDataArray = [];
practicalPrice=targetAmount/30;
practicalUnit=targetAmount/90;
// Assuming input.value and input.current are strings, adjust accordingly if they're different data types
inputs.forEach((input) => {
    dataArray.push(input.value);
    dataArray.push(input.current);
    usageUnit+=input.power;
  });
  usageUnit/=1000;
  usagePrice=usageUnit*6;
  inputs.forEach((input) => {
    electricDataArray.push(input.value);
    electricDataArray.push(input.current);
    electricDataArray.push(input.power);
  });
  console.log(dataArray);
  return (
    <>

  <main className='electric-home'>
        <section className='electric-dash'>
          <p className='electric-dash-header'>Let us plan you a perfect </p>
          <p>Electricity Consumption</p>
          <section className='electric-dash-grid'>
            <article>Electricity Target</article>
            <article>{targetAmount}</article>
            <article>Theory</article>
            <article>{practicalUnit.toFixed(1)} KWH</article>
            <article>$ {practicalPrice.toFixed(1)}</article>
            <article>Usage</article>
            <article>{usageUnit.toFixed(2)} KWH</article>
            <article>$ {usagePrice.toFixed(2)}</article>
          </section>
        </section>
        <section className='electric-recom'>
          <p>The Recommendation of appliances usages per day can be tabulated as</p>
          <section className='electric-recom-grid'>
            <article>Appliances</article>
            <article>Hours</article>
            {dataArray.map((content, index) => (
              <div key={index} className="dynamic-box">
                {content}
              </div>
            ))}
          </section>
        </section>
        <section className='electric-usage'>
          <p>The actual usage of electricity per day </p>
          <article className='electric-usage-grid'>
            <div>Appliances</div>
            <div>hours</div>
            <div>% Used</div>
            {electricDataArray.map((content, index) => (
              <div key={index}>
                {content}
              </div>
            ))}
          </article>
        </section>
      </main>
      <Navbot/>
    </>
  );
}

const mapStateToProps = (state) => ({
  targetAmount: state.targetAmount,
  inputs: state.inputs,
});

export default connect(mapStateToProps)(Home);
