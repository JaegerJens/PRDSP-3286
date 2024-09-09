/**
 * The React App file
 */

// React libraries
import React from 'react';

// Stylings
import './App.scss';

// Application components
import {
    BryntumSchedulerPro,
} from '@bryntum/schedulerpro-react';
import {
    ProjectModel,
    StringHelper
} from '@bryntum/schedulerpro/schedulerpro.umd.js';
import { schedulerConfig, } from './AppConfig';
import { clone, range } from 'lodash';

export const eventTemplate = (eventData) => {
    return `<div>${StringHelper.encodeHtml(eventData.eventRecord.data?.name)}</div>
    `;
};

const timeZones = ['America/Caracas', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'America/New_York', 'America/Sao_Paulo', 'America/St_Johns', 'Asia/Bangkok', 'Asia/Dhaka', 'Asia/Hong_Kong',
    'Asia/Tokyo', 'Australia/Adelaide', 'Australia/Melbourne', 'Europe/London', 'Europe/Helsinki', 'Europe/Moscow',
    'Europe/Stockholm', 'Indian/Maldives', 'Indian/Mahe', 'Pacific/Auckland', 'Pacific/Honolulu'];

const initialTimeZone = timeZones.find(tz => tz.startsWith('Europe'));

const App = () => {
    const [resources, updateResources] = React.useState([{
        "id": 1,
        "name": "Angelo"
    },
    {
        "id": 2,
        "name": "Arnold"
    }, ...range(3, 150).map(id => ({ id, name: "Hello World" }))], []);
    const [events, updateEvents] = React.useState(() => [{
        "id": 1,
        "name": "Ventilation",
        "startDate": "2020-12-01",
        "duration": 1,
        "durationUnit": 'd',
        "timeZone": initialTimeZone,
    }, ...range(2, 100).map(id => ({
        id,
        name: "Test" + id,
        "startDate": new Date(2020, 11, Math.floor(id / 4), (id % 4) * 6),
        "duration": 4,
        "durationUnit": 'h',
    }))], []);
    const [assignments, updateAssignments] = React.useState(() => [{
        id: 1,
        eventId: 1,
        resourceId: 1,
    }, ...range(2, 100).map(id => ({
        id,
        eventId: id,
        resourceId: (id % 2) + 2,
    }))], [])

    const changeResource = (ev) => {
        updateAssignments(asgs => {
            const changedAsg = { 
                ...asgs[0], 
                resourceId: asgs[0].resourceId === 1 ? 2 : 1,
            };
            const updated = [changedAsg, ...asgs.slice(1)];
            return updated;
        });
        ev.preventDefault();
        ev.stopPropagation();
    }

    const [projectModel] = React.useState(() => new ProjectModel({
        silenceInitialCommit: true,
        assignmentStore: {
            syncDataOnLoad: true,
            autoCommit: true,
        },
        eventStore: {
            syncDataOnLoad: true,
        },
        resourceStore: {
            syncDataOnLoad: true,
        },
    }));

    const updating = React.useRef(false);
    React.useEffect(() => {
        if (updating.current) return;
        const asgs = assignments;
        const ress = resources;
        const evts = events;
        (async () => {
            updating.current = true;
            console.log('updating');
            await projectModel.loadInlineData({
                eventsData: evts,
                resourcesData: ress,
                assignmentsData: asgs.map(asg => clone(asg)),
            });
            console.log('finished updating');
            updating.current = false;
        })();
    }, [assignments, events, projectModel, resources])

    const syncResources = () => {
        updateResources(resources.map(resource => clone(resource)))
    };
    const syncEvents = () => {
        updateEvents(events.map(event => clone(event)));
    };

    const [currentTz, setTimeZone] = React.useState(initialTimeZone);
    React.useEffect(() => {
        projectModel.timeZone = currentTz;
    }, [currentTz, projectModel])
    const changeTimezone = (ev) => {
        const nextTz = timeZones[ev.target.value];
        console.log(`change timezone to ${nextTz}`);
        setTimeZone(nextTz);
    }

    return <div style={{ minHeight: '50vh' }}>
        <div style={{ display: 'flex', margin: '1rem' }}>
            <button type="button" onClick={changeResource}>Switch assignment of Ventilation</button>
            <button type="button" onClick={syncResources}>Sync resources</button>
            <button type="button" onClick={syncEvents}>Sync events</button>
            <select name="timeZone" onChange={changeTimezone}>
                {timeZones.map((tz, index) => <option key={index} selected={currentTz === tz} value={index}>{tz}</option> )}
            </select>
        </div>
        <BryntumSchedulerPro {...schedulerConfig}
            project={projectModel}
            eventStyle="regular"
            nonWorkingTimeFeature={{
                highlightWeekends: true,
            }}
            eventRenderer={eventTemplate}
            headerMenuFeature={false} // disables menu together with sorting of resource columns
            cellMenuFeature={false} // removes menu on resource column cells
            dependencyEditFeature={false} // also removes circle shaped handles
            dependenciesFeature={false}
            columnPickerFeature={false}
            eventMenuFeature={{
                items: {
                    deleteEvent: false,
                    unassignEvent: false,
                },
            }}
            sortFeature={false}
            eventCopyPasteFeature={false}
            eventDragCreateFeature={false}
            scheduleTooltipFeature={false}
            scheduleMenuFeature={{
                items: {
                    addEvent: false,
                },
            }}
            cellEditFeature={false}
            timeAxisHeaderMenuFeature={{
                items: {
                    zoomLevel: false,
                    eventsFilter: false,
                    dateRange: false,
                },
            }}
            taskEditFeature={false}
            headerZoomFeature={false}
            eventEditFeature
            createEventOnDblClick={false}
            enableDeleteKey={false} />
    </div >
};

export default App;
