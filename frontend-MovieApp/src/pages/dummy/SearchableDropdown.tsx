import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';

const StudyDropdown = () => {
    const [selectedStudy, setSelectedStudy] = useState<string | null>(null);

    // Sample data, replace with your actual study list.
    const studies = [
        { label: 'A0221124', value: 'A0221124' },
        { label: 'B6754367', value: 'B6754367' },
        { label: 'C5775688', value: 'C5775688' }
    ];

    return (
        <div>
            {/* Dropdown with search functionality */}
            <Dropdown
                value={selectedStudy}
                options={studies}
                onChange={(e) => setSelectedStudy(e.value)}
                placeholder="Search and Select a Study"
                filter
                filterBy="label" // You can change this based on the key you want to filter
                showClear
                style={{ width: '50%' }} // Makes it look more like a search box
            />
        </div>
    );
};

export default StudyDropdown;
