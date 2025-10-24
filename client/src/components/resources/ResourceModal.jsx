import React, { useState } from 'react';
import Input from '../ui/Input'; // Assuming Input component is in ../ui/
import Button from '../ui/Button'; // Assuming Button component is in ../ui/
import ErrorMessage from '../ui/ErrorMessage'; // Assuming ErrorMessage component is in ../ui/

const ResourceModal = ({ type = 'add', resourceData = null, onClose, onSubmit }) => {
  const title = type === 'edit' ? 'Edit Resource' : 'Add Resource';

  // State to hold form data, initialized with resourceData or defaults
  const [formData, setFormData] = useState({
    name: resourceData?.Name || '',
    unit: resourceData?.Unit || '',
    role: resourceData?.Role || '',
    generalization: resourceData?.Generalization || '',
    specialization: resourceData?.Specialization || '',
    capacityPerWeek: resourceData?.CapacityPerWeek || '',
    rateCard: resourceData?.RateCard || '',
  });

  // State for holding the error message
  const [error, setError] = useState(null);

  // Handler to update form state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear error when user starts typing/changing values
    if (error) {
      setError(null);
    }
  };

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    const form = e.target;

    // Check form validity
    if (!form.checkValidity()) {
      const firstInvalidField = form.querySelector(':invalid');
      let fieldLabel = 'A required field'; // Default message
      if (firstInvalidField) {
        const fieldContainer = firstInvalidField.closest('.flex.flex-col.gap-2');
        const labelElement = fieldContainer?.querySelector('label');
        if (labelElement) {
          fieldLabel = labelElement.textContent.replace('*','').trim();
        }
      }
      setError(`Please fill out the '${fieldLabel}' field.`); // Set error message
      return; // Stop submission
    }

    // Prepare data for submission
    const dataToSubmit = {
      Name: formData.name,
      Unit: formData.unit || null, // Send null if empty
      Role: formData.role || null,
      Generalization: formData.generalization || null,
      Specialization: formData.specialization || null,
      CapacityPerWeek: parseFloat(formData.capacityPerWeek) || null, // Convert to number or null
      RateCard: parseFloat(formData.rateCard) || null, // Convert to number or null
      // Add ResourceID if editing
      ...(type === 'edit' && resourceData?.ResourceID && { ResourceID: resourceData.ResourceID })
    };

     // Optional: Further cleanup if backend strictly requires null instead of empty strings for non-required fields
     // Object.keys(dataToSubmit).forEach(key => {
     //     if (dataToSubmit[key] === '') {
     //         dataToSubmit[key] = null;
     //     }
     // });

    setError(null); // Clear error on successful validation attempt
    console.log("Submitting Resource:", dataToSubmit); // For debugging
    onSubmit(dataToSubmit); // Pass the collected data
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-30 z-50 overflow-y-auto p-8">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 relative font-sans">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 text-2xl font-bold hover:text-primary-dark"
          aria-label="Close modal"
        >
          ×
        </button>
        <h2 className="text-primary text-h2 font-sans mb-6">{title}</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {/* Add value, onChange, required, and name props */}
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            label="Unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            required // Assuming all fields are required as per request
          />
          <Input
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          />
          <Input
            label="Generalization"
            name="generalization"
            value={formData.generalization}
            onChange={handleChange}
            required
          />
          <Input
            label="Specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Capacity per Week (Hrs)"
              name="capacityPerWeek"
              type="number" // Set type to number
              value={formData.capacityPerWeek}
              onChange={handleChange}
              required
              step="any" // Allow decimals
              min="0" // Set minimum value
            />
            <Input
              label="Rate Card"
              name="rateCard"
              type="number" // Set type to number
              value={formData.rateCard}
              onChange={handleChange}
              required
              step="any" // Allow decimals
              min="0" // Set minimum value
            />
          </div>

          <div className="mt-6 flex flex-col gap-4">
             <ErrorMessage title="Validation Error" message={error} />
            <Button label="Done" type="submit" className="w-full" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceModal;
