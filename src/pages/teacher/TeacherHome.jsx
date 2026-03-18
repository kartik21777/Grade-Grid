import React from 'react';
import Card from '../../components/Card';

const TeacherHome = () => (
  <div className='card-container'>
    <Card styles="card card-schedule" heading={'📅 Schedule'} text={'View your weekly timetable'} linkTo={'schedule'} />

    <Card styles="card card-class" heading={'📚 Classes'} text={'Manage sections & assignments'} linkTo={'classes'} />

    <Card styles="card card-assignments" heading={'⏰ Assignments'} text={'Track upcoming due dates'} linkTo={'assignments'} />

    <Card styles="card card-assignments-grading" heading={'📊 Assignment Grading'} text={'Evaluate student submissions and provide feedback'} linkTo={'grade-assignment'} />

    <Card styles="card card-student-search" heading={'🔍 Student Search'} text={'Find student by roll number and edit grades'} linkTo={'search-student'} />
  </div>
);

export default TeacherHome;