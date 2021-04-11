import React from 'react';
import GardenForm from '../components/garden-form';

export default class PlantDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      plant: null,
      btnClicked: false,
      btnText: 'Add to garden',
      gardenCreated: null,
      modalClass: 'hidden'
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    fetch(`http://harvesthelper.herokuapp.com/api/v1/plants/${this.props.plantId}?api_key=${process.env.HARVEST_HELPER_API_KEY}`)
      .then(res => res.json())
      .then(data => {
        return this.setState({
          plant: data
        });
      });
    console.log('componentDidMount');
    fetch('/api/gardenStats')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.length !== 0) {
          this.setState({
            gardenCreated: true
          });
        }
      });
  }

  handleClick() {
    if (!this.state.gardenCreated) {
      this.setState({
        btnClicked: true,
        modalClass: 'garden-form-container'
      });
      console.log('this.state.modalClass', this.state.modalClass);
    }
    this.setState({
      btnClicked: true,
      modalClass: 'garden-form-container'
    });
    console.log('this.state.modalClass', this.state.modalClass);
  }

  render() {
    if (!this.state.plant) return null;
    const plant = this.state.plant;
    const imgName = plant.name.replace(' ', '_');
    return (
      <>
      <GardenForm className={this.state.modalClass} />
        <div className="plant-card">
          <img className="plant-img"
            src={`/images/${imgName}.jpg`}
            alt="vegetable" />
          <div className="row">
            <h5 className="card-title">{plant.name}</h5>
            <button className="add-remove-btn" onClick={this.handleClick}>{this.state.btnText}</button>
          </div>
          <div className="card-body">
            <h4 className="subsection">About</h4>
            <p className="plant-info">{plant.description}</p>
            <h4 className="subsection">Plant Care</h4>
            <p className="subtitle">Optimal Sun</p>
            <p className="plant-info">{plant.optimal_sun}</p>
            <p className="subtitle">Optimal Soil</p>
            <p className="plant-info">{plant.optimal_soil}</p>
            <p className="subtitle">Planting Considerations</p>
            <p className="plant-info">{plant.planting_considerations}</p>
            <p className="subtitle">When to Plant</p>
            <p className="plant-info">{plant.when_to_plant}</p>
            <p className="subtitle">Growing from Seed</p>
            <p className="plant-info">{plant.growing_from_seed}</p>
            <p className="subtitle">Transplanting</p>
            <p className="plant-info">{plant.transplanting}</p>
            <p className="subtitle">Spacing</p>
            <p className="plant-info">{plant.spacing}</p>
            <p className="subtitle">Watering</p>
            <p className="plant-info">{plant.watering}</p>
            <p className="subtitle">Feeding</p>
            <p className="plant-info">{plant.feeding}</p>
            <p className="subtitle">Other Care</p>
            <p className="plant-info">{plant.other_care}</p>
            <p className="subtitle">Diseases</p>
            <p className="plant-info">{plant.diseases}</p>
            <p className="subtitle">Pests</p>
            <p className="plant-info">{plant.pests}</p>
            <p className="subtitle">Harvesting</p>
            <p className="plant-info">{plant.harvesting}</p>
            <p className="subtitle">Storage Use</p>
            <p className="plant-info">{plant.storage_use}</p>
          </div>
        </div>
      </>
    );
  }
}
