import React from 'react';
import Card from '../../components/Card';

const TeacherHome = ({ styles }) => (
  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
    <Card styles={{ ...styles.card, borderTop: '4px solid #ea4335' }} heading={'📅 Schedule'} text={'View your weekly timetable'} linkTo={'schedule'}/>

    <Card styles={{ ...styles.card, borderTop: '4px solid #34a853' }} heading={'📚 Classes'} text={'Manage sections & assignments'} linkTo={'classes'}/>

    <Card styles={{ ...styles.card, borderTop: '4px solid #3538ea' }} heading={'⏰ Assignments'} text={'Track upcoming due dates'} linkTo={'assignments'}/>
  </div>
);

export default TeacherHome;