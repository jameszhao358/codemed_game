import React, { useState } from 'react';

function InvestigationMenu({ onInvestigationClick }) {
    const [activeSubmenu, setActiveSubmenu] = useState(null);
  
    const submenuOptions = {
      bedside: ['ECG', 'Urinalysis', 'ABG', 'BSL'],
      labs: ['FBC', 'Cultures', 'Coags', 'EUC', 'LFT', 'CRP', 'Troponins'],
      imaging: ['Echocardiogram', 'CXR', 'Coronary Angiogram', 'CT Angiogram'],
      special: ['Biopsy', 'Genetic Test', 'EEG']
    };
  
    const handleMenuClick = (category) => {
      setActiveSubmenu(activeSubmenu === category ? null : category);
    };
  
    return (
      <div className="investigation-component">
        <div className="menu-container">
          {['BEDSIDE', 'LABS', 'IMAGING', 'SPECIAL'].map((category) => (
            <button
              key={category}
              className="menu-button"
              onClick={() => handleMenuClick(category.toLowerCase())}
            >
              {category}
            </button>
          ))}
        </div>
  
        {activeSubmenu && (
          <div className="submenu-container">
          {submenuOptions[activeSubmenu].map((option) => (
            <button
              key={option}
              className="submenu-button"
              onClick={() => onInvestigationClick(option)} // Pass the clicked investigation name
            >
              {option}
            </button>
          ))}
        </div>
        )}
      </div>
    );
  }
  
  export default InvestigationMenu;