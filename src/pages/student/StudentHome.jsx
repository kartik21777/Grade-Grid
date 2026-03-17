import React from 'react';
import Card from '../../components/Card';

const StudentHome = () => (
    <div className='card-container'>
        <Card styles="card card-assignments" heading={'⏰ Assignments'} text={'Track upcoming due dates'} linkTo={'assignments'} />

        <Card styles="card card-schedule" heading={'📝 Results'} text={'View checked assignments and marks'} linkTo={'results'} />
    </div>
);

export default StudentHome;