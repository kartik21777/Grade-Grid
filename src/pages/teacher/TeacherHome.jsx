import React from 'react';
import Card from '../../components/Card';

const TeacherHome = () => (
  <div className='card-container'>
    <Card styles="card card-schedule" heading={'📅 Schedule'} text={'View your weekly timetable'} linkTo={'schedule'}/>

    <Card styles="card card-class" heading={'📚 Classes'} text={'Manage sections & assignments'} linkTo={'classes'}/>

    <Card styles="card card-assignments" heading={'⏰ Assignments'} text={'Track upcoming due dates'} linkTo={'assignments'}/>
  </div>
);

export default TeacherHome;