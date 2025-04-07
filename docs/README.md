# BOTCoin Explorer

All container must be abstracted into a series of presenational and stateful components.This document will outline the required components for each container and the level of abstraction.

# Containers

Currently a `container` is defined aa page which holds any type of components. These `containers` can be futher classified into react components that detail or list/display a certain object.

Firstly we will start with the `Dashboard` container. This the landing page of BOTCoin Explorer and has many components with in it.

More formally these are the components

-   `SAlert`
-   `SStatistic`
-   `Whitelist`
-   `Nominees`
-   `Evictees`
-   `Validators`

Some of the abstraction has already been done. However these needs to be higher order components purely to simplyfy logic some components such as the `SStatistic`.
