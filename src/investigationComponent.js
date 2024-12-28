import React, { useState } from 'react';

function InvestigationMenu({ onInvestigationClick }) {
    const [activeSubmenu, setActiveSubmenu] = useState(null);
  
    const submenuOptions = {
      bedside: ['ECG', 'Urinalysis', 'ABG', 'BSL'],
      labs: [
        { name: 'FBC', tubeColor: 'purple' },
        { name: 'Coags', tubeColor: 'light-blue' },
        { name: 'Cultures', tubeColor: 'red' },
        { name: 'EUC', tubeColor: 'gold' },
        { name: 'LFT', tubeColor: 'gold' },
        { name: 'CRP', tubeColor: 'gold' },
        { name: 'Troponins', tubeColor: 'gold' },
        { name: 'TFT', tubeColor: 'gold' }
      ],
      imaging: ['CXR', 'Echocardiogram', 'Coronary Angiogram', 'CT Angiogram'],
      special: ['Endomyocardial Biopsy', 'Stress Test', 'Right Heart Catheterisation']
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
          {submenuOptions[activeSubmenu].map((option) => {
            // Check if option is an object (labs) or string (other categories)
            const isLabOption = typeof option === 'object';
        
            return (
              <button
                key={isLabOption ? option.name : option}
                className={`submenu-button ${isLabOption ? option.tubeColor : ''}`} // Add tubeColor class only for labs
                onClick={() => onInvestigationClick(isLabOption ? option.name : option)}
              >
                {isLabOption ? option.name : option}
              </button>
            );
          })}
        </div>
        )}
      </div>
    );
  }
  
  export default InvestigationMenu;