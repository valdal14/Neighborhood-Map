# Neighborhood-Map

This Neighborhood-Map project has been developed during the **Udacity NanoDegree Program** 
This web application allows the user to pass an array of object locations to the class Map and retrieve google maps locations inside a google map instance with related markers. 

***

## How to Run 

In order to run the game just simply download or clone the [repository](https://github.com/valdal14/Neighborhood-Map) and click on the **index.html** file inside it.

***

## How to use it

When the application is loaded in the browser, it retrieves deafult in-memory locations and add google markers to the map.

Users can click on the markers to see the description of the location. 

Users can also filters by address in the list of location of by typing the location address itself or using the location description:

* Park
* Tavern
* Monument
* Museum
* Heritage Museum

**Note:** Searching in the filter textbox is case-sensitive - User must capitalize the first letter of the location description.  

**Sample Screen** of the application up and running 

 ![Start](https://github.com/valdal14/Neighborhood-Map/blob/master/screenshots/screen-1.png?raw=true "Application Started")

 **Mobile Screen** of the application up and running 

 ![Start](https://github.com/valdal14/Neighborhood-Map/blob/master/screenshots/mobile-2.png?raw=true "Application Started")

  **Filter Screen** of the application up and running 

 ![Start](https://github.com/valdal14/Neighborhood-Map/blob/master/screenshots/mobile-3.png?raw=true "Application Started")

When the **Neighborhood-Map** starts it execute an async call to retrieve the markers and in case of errors it will display a bootstrap modal with the error information.

![Error](https://github.com/valdal14/Neighborhood-Map/blob/master/screenshots/error.png?raw=true "Error Handling")



## Contribution

You can [download](https://github.com/valdal14/Neighborhood-Map) the source code and play with it if you want to improve it. If you spot some bugs, feel free to fix them. 

***

## License

Licence detail about the use of this project is available at the following [URL](https://github.com/valdal14/Neighborhood-Map/blob/master/LICENSE)
