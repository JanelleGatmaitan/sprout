import React from 'react';
import GardenForm from '../components/garden-form';
import DeleteModal from '../components/delete-confirmation';
import AppContext from '../lib/app-context';
import getLocalStorage from '../lib/get-localStorage';
import SavedPlant from '../components/list-view-plant-card';
import AlertComponent from '../components/alert';
import { Flex } from '@chakra-ui/react';
import Tasks from '../components/tasks';
import removePlant from '../lib/remove-plant';

export default class ListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gardenId: null,
      plantsInGarden: null,
      tasksCompleted: {
        Water: null,
        Compost: null,
        Prune: null
      },
      gardenInfo: {
        soil: '',
        sun: '',
        size: '',
        notes: ''
      },
      isDeleteModalOpen: false,
      toDeleteId: null,
      isAlertOpen: false,
      alertDisplay: 'none',
      alertStyling: {
        status: 'error',
        title: '',
        description: ''
      }
    };
    this.onClick = this.onClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.cancelRemoval = this.cancelRemoval.bind(this);
    this.clickDeleteBtn = this.clickDeleteBtn.bind(this);
    this.getGardenData = this.getGardenData.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
    this.getAlertDisplay = this.getAlertDisplay.bind(this);
    this.getTaskClass = this.getTaskClass.bind(this);
  }

  componentDidMount() {
    this.getGardenData();
  }

  async getGardenData() {
    const data = getLocalStorage('user-data');
    const username = data.username;
    const response = await fetch(`/api/gardenStats/${username}`);
    const gardenData = await response.json();
    if (gardenData.gardenCreated) {
      const plantData = await fetch(`/api/plantsInGarden/${gardenData.gardenStats.gardenId}`);
      const plantsInGarden = await plantData.json();
      const tasks = await fetch(`api/tasksCompleted/${gardenData.gardenStats.gardenId}`);
      const tasksStatus = await tasks.json();
      this.setState({
        gardenInfo: gardenData.gardenStats,
        gardenId: gardenData.gardenStats.gardenId,
        plantsInGarden: plantsInGarden,
        tasksCompleted: tasksStatus
      });
    }
  }

  onClick(event) {
    const taskName = event.target.innerText;
    const previousStatus = this.state.tasksCompleted[taskName];
    const tasksCompletedCopy = Object.assign({}, this.state.tasksCompleted);
    tasksCompletedCopy[taskName] = !previousStatus;
    this.setState({
      tasksCompleted: tasksCompletedCopy
    });
    fetch(`/api/tasksCompleted/${this.state.gardenId}`, {
      method: 'PUT',
      body: JSON.stringify(tasksCompletedCopy),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .catch(err => console.error(err));
  }

  getTaskClass(taskName) {
    if (this.state.tasksCompleted[taskName]) {
      return 'task-completed';
    }
    return 'task-incomplete';
  }

  handleChange(event) {
    const gardenCopy = Object.assign({}, this.state.gardenInfo);
    const target = event.target;
    const value = target.value;
    const name = target.name;
    gardenCopy[name] = value;
    this.setState({
      gardenInfo: gardenCopy
    });
  }

  handleSave(event) {
    event.preventDefault();
    fetch(`/api/gardenStats/${this.state.gardenId}`, {
      method: 'PUT',
      body: JSON.stringify(this.state.gardenInfo),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.ok) {
          this.setState({
            isAlertOpen: true,
            alertStyling: {
              status: 'success',
              title: 'Saved!',
              description: 'Your changes have been saved successfully.'
            }
          });
        } else {
          this.setState({
            isAlertOpen: true,
            alertStyling: {
              status: 'error',
              title: 'Error!',
              description: 'Your changes were not saved.'
            }
          });
        }
      })
      .catch(err => console.error(err));
  }

  closeAlert() {
    this.setState({
      isAlertOpen: false
    });
  }

  getAlertDisplay() {
    if (this.state.isAlertOpen) {
      setTimeout(() => this.closeAlert(), 3000);
      return '';
    }
    return 'none';
  }

  clickDeleteBtn(event) {
    this.setState({
      isDeleteModalOpen: true,
      toDeleteId: event.target.getAttribute('plantid')
    });
  }

  getDeleteModalClass() {
    if (this.state.isDeleteModalOpen) {
      return '';
    }
    return 'none';
  }

  cancelRemoval() {
    this.setState({
      isDeleteModalOpen: false
    });
  }

  handleRemove(event) {
    const deletedPlantId = this.state.toDeleteId;
    fetch(`/api/plantsInGarden/${this.state.gardenId}/${deletedPlantId}`, {
      method: 'DELETE'
    })
      .then(() => {
        this.setState({
          isDeleteModalOpen: false,
          plantsInGarden: removePlant(this.state.plantsInGarden, deletedPlantId)
        });
      }
      )
      .catch(err => console.error(err));
  }

  render() {
    if (!this.state.gardenId) {
      return (
        <div className="prompt">
          <p>Plant something to create a garden!</p>
          <a href="#">
            <p className="find-plant">Find a plant.</p>
          </a>
        </div>
      );
    }

    return (
      <>
        <GardenForm
          id="column-left"
          positioning="relative"
          title="My Garden"
          gardenFormValues={this.state.gardenInfo}
          onSave={this.handleSave}
          handleChange={this.handleChange}
        />
        <AlertComponent
          hide={this.getAlertDisplay}
          alertStyles={this.state.alertStyling}
          close={this.closeAlert}
        />
        <Tasks
        getTaskClass={this.getTaskClass}
        clickTask={this.onClick}
        />
        <Flex
          wrap="wrap"
          justifyContent="center"
          my="15px"
        >
          {
            this.state.plantsInGarden.map(plant => (
                <SavedPlant
                delete={this.clickDeleteBtn}
                key={plant.plantId}
                plant={plant}
                clickYes={this.handleRemove}
                />
            ))
          }
        </Flex>
        <DeleteModal hide={this.getDeleteModalClass()} clickYes={this.handleRemove} clickNo={this.cancelRemoval} />
      </>
    );
  }
}

ListView.contextType = AppContext;
