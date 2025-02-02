import { Separator } from "@/components/ui/separator";
import { FaCheck, FaTrash } from "react-icons/fa";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteObject, ref } from "firebase/storage";
import { storage } from '../../../lib/firbase';
import { supabase } from "../../../lib/initSupabase";
import AlertAccountCard from './../../../components/AlertCard';
import { Textarea } from './../../../components/ui/textarea';
import Dropdown from "../../add-car/components/Dropdown";
import CarDetails from "./../../../data/CarDetails.json";
import features from "./../../../data/features.json";
import { Checkbox } from "../../../components/ui/checkbox";
import InputField from "../../add-car/components/InputField";
import { EditCar } from "../../../lib/actions";

function UserCar({ car, setCarDetailsOpened, setUserCars, userCars }) {
  const [showAlert, setShowAlert] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [editedCar, setEditedCar] = useState(car);
  const [selectedFeatures, setSelectedFeatures] = useState(car?.features || []);

  const handleFeaturesChange = (featureName, isChecked) => {
    setEditedCar((prevInfo) => {
      const updatedFeatures = isChecked
        ? [...prevInfo.features, featureName]
        : prevInfo.features.filter((feature) => feature !== featureName);
      return { ...prevInfo, features: updatedFeatures };
    });
    setSelectedFeatures((prevFeatures) =>
      isChecked
        ? [...prevFeatures, featureName]
        : prevFeatures.filter((feature) => feature !== featureName)
    );
  };
  console.log(editedCar);

  const HandleRemoveCar = async (item) => {
    try {
      for (let image of item.CarImages) {
        const target_image = image?.imageUrl;
        const storageRef = ref(storage, target_image);
        await deleteObject(storageRef);
        console.log('Image successfully deleted from Firebase');
      }

      await supabase.from('CarImages').delete().eq('CarListingId', item.id);
      const response = await supabase.from('CarListing').delete().eq('id', item.id);

      if (response) {
        setUserCars(userCars.filter((car) => car.id !== item.id));
        setCarDetailsOpened(false);
      }
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  const HandleSelectRemoveCar = (car) => {
    setShowAlert(true);
    setCarToDelete(car);
  };

  const HandleConfirm = () => {
    HandleRemoveCar(carToDelete);
    setShowAlert(false);
  };

  const HandleCancel = () => {
    setCarToDelete(null);
    setShowAlert(false);
  };

  const handleFormChange = (name, value) => {
    setEditedCar((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const HandleSelectSave = async () => {
    try {
      const { CarImages, ...carWithoutImages } = editedCar;
  
      const response = await EditCar("edit", carWithoutImages?.id, carWithoutImages, selectedFeatures, carWithoutImages?.user);
  
      if (response.error) {
        console.error("Error updating car:", response.error);
      } else {
        setUserCars((prevUserCars) =>
          prevUserCars.map((car) =>
            car.id === editedCar.id ? { ...car, ...carWithoutImages, features: selectedFeatures } : car
          )
        );
      }
    } catch (error) {
      console.error("Error saving car:", error);
    } finally {
      setCarDetailsOpened(false);
    }
  };


  return (
    <>
      {/* Main Container to Prevent Overflow */}
      <div className="overflow-hidden">
        <div className="flex justify-end">
          <Button className="hover:bg-red-500 mx-5 justify-end" onClick={() => HandleSelectRemoveCar(editedCar)}>
            <FaTrash />
          </Button>
        </div>

        {/* Header Section */}
        <div className="flex flex-col items-center mb-5">
          <h2 className="font-bold text-center text-3xl p-3">{editedCar.model}</h2>
          <Separator className="bg-black m-6 w-[50%]" />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Car Images */}
          {editedCar.CarImages?.map((image, index) => (
            <div key={index} className="p-2">
              <img
                className="w-full h-auto rounded-lg object-cover"
                src={image.imageUrl}
                alt={`Car Image ${index + 1}`}
              />
            </div>
          ))}
        </div>

        <Separator className="bg-gray-400 mb-10" />

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CarDetails.CarDetails.map((detail, index) => (
            detail.name !== "description" && <div key={index} className="text-lg mb-6 border rounded-lg p-4 shadow-lg">
              <label className="text-sm">
                {detail.label} {detail.required && <span className="text-red-600">*</span>}
              </label>
              {detail.fieldType === "text" || detail.fieldType === "number" ? (
                <InputField
                  className={`block p-3 border rounded-lg bg-gray-300 mt-1`}
                  carInfo={editedCar}
                  handleFormChange={handleFormChange}
                  item={detail}
                />
              ) : detail.fieldType === "dropdown" ? (
                <Dropdown
                  className={`p-3 border rounded-lg bg-gray-300 mt-1`}
                  carInfo={editedCar}
                  handleFormChange={handleFormChange}
                  item={detail}
                />
              ) : null}
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="text-lg mt-6 rounded-lg p-4">
          <span className="font-semibold text-gray-700">Features:</span>
          <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-2">
            {features.CarFeatures.map((item, index) => (
              <div key={index} className="flex gap-2 items-center py-2">
                <Checkbox
                  checked={selectedFeatures.includes(item.name)}
                  onCheckedChange={(checked) => handleFeaturesChange(item.name, checked)}
                />
                <h2 className="font-medium">{item.label}</h2>
              </div>
            ))}
          </div>
        </div>

        {/* Description Section */}
        <div className="text-lg mt-6 rounded-lg p-6">
          <span className="font-semibold text-gray-700">Description:</span>
          <Textarea
            className="text-gray-600 p-3 border rounded-lg bg-gray-300 mt-1 w-full"
            value={editedCar.description}
            onChange={(e) => handleFormChange("description", e.target.value)}
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-center m-5">
          <Button className="hover:bg-blue-400 rounded-lg" onClick={HandleSelectSave}>
            Save
          </Button>
        </div>

        {showAlert && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <AlertAccountCard
                onConfirm={HandleConfirm}
                onCancel={HandleCancel}
                toDelete={"Car"}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default UserCar;