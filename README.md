![Age of Makers Logo](https://raw.githubusercontent.com/salesforce/ageofmakers/master/images/Age_of_Makers_full_m.png?token=AAVZPWYZWN2LP52QOKS4N626VB62E)

# Age of Makers (AoM)

Become an independent learner, solving the world’s biggest challenges using 3D printing, coding & electronics.

## Building the Age of Makers game locally

After running a `yarn install`, simply use gulp to compile the game into the `build` folder:
```bash
gulp build # one time build
gulp watch # re-run the build as you're developing on the game and saving file changes
```

*Note: Make sure you've installed gulp globally to be able to run it in the CLI (`npm install -g gulp`)*

### Loading a local Age of Makers Developer Extention in Chrome.

1. In a Chrome browser, navigate to `Chrome Menu > More Tools > Extensions`.

2. Make sure the **Developer Mode** box is checked on the top right.

3. Click **Load unpacked**

4. Select the "build" folder that gets build from gulp in your local github repo.
