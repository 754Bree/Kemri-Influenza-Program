import React, { createContext, useState, useContext } from "react";

const FormContext = createContext();

export const FormProvider = ({ children }) => {
    const [formData, setFormData] = useState({});

    // Function to update form data
    const updateFormData = (newData) => {
        setFormData((prevData) => ({ ...prevData, ...newData }));
    };

    return (
        <FormContext.Provider value={{ formData, updateFormData }}>
            {children}
        </FormContext.Provider>
    );
};

// Custom Hook to use FormContext
export const useFormContext = () => useContext(FormContext);
