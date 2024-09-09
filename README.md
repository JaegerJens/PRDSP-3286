# Bryntum time zone support

This repo tries to analyse the time zone support of [Bryntum Scheduler
Pro](https://bryntum.com/products/schedulerpro/).

* [Bryntum demo](https://bryntum.com/products/schedulerpro/examples/timezone/)
* [Bryntym documentation](https://bryntum.com/products/schedulerpro/docs/api/Scheduler/model/ProjectModel#config-timeZone)

Internal issue is PRDSP-3286.

## Reproduce bug

* install dependencies
* `npm run start`
* select "America/Chicago" from top dropdown
* press multiple times the button "Sync events"

expect result: events stay same time

actual result: events move into the future
