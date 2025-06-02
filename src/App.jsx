//import modules
import { useState, useEffect } from 'react'
//import service
import * as petService from './services/petService';
//import components
import PetList from './components/PetList/PetList';
import PetDetail from './components/PetDetail/PetDetail';
import PetForm from './components/PetForm/PetForm';

const App = () => {
  const [pets, setPets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

// Create a new useEffect
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const fetchedPets = await petService.index();
        // Don't forget to pass the error object to the new Error
        if (fetchedPets.err) {
          throw new Error(fetchedPets.err);
        }
        setPets(fetchedPets);
      } catch (err) {
        // Log the error object
        console.log(err);
      }
    };
    fetchPets();
  }, []);
//select a pet
  const handleSelect = (pet) => {
    setSelected(pet)
    // Close the form if it's open when a new pet is selected.
    setIsFormOpen(false);
  }
//toggle form open and close
  const handleFormView = (pet) => {
    if (!pet._id) setSelected(null);
    setIsFormOpen(!isFormOpen);
  };
//handle the form submission
  const handleAddPet = async (formData) => {
    try {
      const newPet = await petService.create(formData);
          if (newPet.err) {
              throw new Error(newPet.err);
            }
// Add the pet object and the current pets to a new array, and
// set that array as the new pets
      setPets([newPet, ...pets]);
// Close the form after we've added the new pet
    setIsFormOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdatePet = async (formData, petId) => {
    try {
      const updatedPet = await petService.update(formData, petId);

      // handle potential errors
      if (updatedPet.err) {
        throw new Error(updatedPet.err);
      }

      const updatedPetList = pets.map((pet) => (
        // If the _id of the current pet is not the same as the updated pet's _id,
        // return the existing pet.
        // If the _id's match, instead return the updated pet.
        pet._id !== updatedPet._id ? pet : updatedPet
      ));
      // Set pets state to this updated array
      setPets(updatedPetList);
      // If we don't set selected to the updated pet object, the details page will
      // reference outdated data until the page reloads.
      setSelected(updatedPet);
      setIsFormOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeletePet = async (petId) => {
    try {
      const deletedPet = await petService.deletePet(petId);
      console.log(deletedPet);
      // handle potential errors
      if (deletedPet.err) {
        throw new Error(deletedPet.err);
      }
      // Filter out the deleted pet from the pets array
      const updatedPets = pets.filter((pet) => pet._id !== petId);
      setPets(updatedPets);
      //reset selected and close the form
      setSelected(null);
      setIsFormOpen(false);
    } catch (err) {
      console.log(err);
    }
  }


// Return the new PetList component inside a React fragment.
  return (
    <>
      <PetList 
        pets={pets}
        handleSelect={handleSelect}
        handleFormView={handleFormView}
        isFormOpen={isFormOpen}
        />
  {/* Pass selected to PetForm and handleFormView to PetDetail */}
 {isFormOpen ? (
        <PetForm
          handleAddPet={handleAddPet}
          selected={selected}
          handleUpdatePet={handleUpdatePet}
        />
      ) : (
        <PetDetail selected={selected} handleFormView={handleFormView}/>
      )}
    </>
  );
};
export default App;
