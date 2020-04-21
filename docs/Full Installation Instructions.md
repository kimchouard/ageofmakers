# Age of Makers - Chrome Extension

## Full-step installation Guide

> Credit @LtAstros & @DeAngeloD

### Step 1: Creating and Connecting an SSH Key to Github.

1. Open the Terminal.

2. Paste the text below, substituting in your GitHub email address.
```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

3. When you're prompted to "Enter a file in which to save the key," press Enter. This accepts the default file location.
```text
- Enter a file in which to save the key (/Users/you/.ssh/id_rsa): [Press enter]
```

4. At the prompt for creating a new paraphrase, press ENTER. For more information, see "Working with SSH key passphrases".
```text
- Enter passphrase (empty for no passphrase): [Type a passphrase]
Enter same passphrase again: [Type passphrase again]
```

5. Start the ssh-agent in the background.
```bash
eval "$(ssh-agent -s)"
```

6. Add your SSH private key to the ssh-agent and store your passphrase in the keychain. If you created your key with a different name, or if you are adding an existing key that has a different name, replace id_rsa in the command with the name of your private key file.
```bash
ssh-add -K ~/.ssh/id_rsa
```

7. Copy the SSH key to your clipboard.
If your SSH key file has a different name than the example code, modify the filename to match your current setup. When copying your key, don't add any newlines or whitespace.
```
pbcopy < ~/.ssh/id_rsa.pub
```

8. Open Github to your profile.

9. In the upper-right corner of any page, click your profile photo, then click Settings.

10. In the user settings sidebar, click SSH and GPG keys.

11. Click New SSH key or Add SSH key.

12. In the "Title" field, add a descriptive label for the new key. For example, if you're using a personal Mac, you might call this key "Personal MacBook Air".

13. Paste your key into the "Key" field.

14. Click Add SSH key.

15. If prompted, confirm your GitHub password.


--------------------------------------------------------
### Step 2: Establishing Brew and Node to Your Computer.

1. Open the Terminal.

2. Open the Homebew website.

- https://brew.sh/

3. Install Homebrew by pasting this text into the Terminal.
```bash
- /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

4. Install Node by pasting this text into the Terminal after Homebrew is installed.
```bash
brew install node
```

--------------------------------------------------------
### Step 3: Cloning The Age of Makers Repository and Getting Node Pack Manager (NPM) and Gulp into The Repository.

1. From your Terminal clone the repository by pasting this text.
```bash
- git clone git@github.com:ageofmakers/ageofmakers-chrome.git
```

2. Change your directory to the repository by using this command.
```bash
cd ageofmakers-chrome
```


3. Download node packet manager by typing this command into the Terminal.
```bash
npm install
```

4. Install gulp by typing this command into the Terminal.
```bash
npm install -g gulp
```
--------------------------------------------------------

### Step 4: Getting the Age of Makers Developer Extention on Chrome.

1. Open a new Chrome browser.

2. Right click your extentions, navigating to "Manage Extentions."

3. Make sure the "Developer Mode" box is checked.

4. Click "Load unpacked extention..."

5. Using the file directory, locate the "AgeofMakers" file, selecting the "Build" file.

--------------------------------------------------------
### Step 5: Building Gulp and Creating a Age of Makers Browser Tab.

1. Go back to the Terminal, type in this command.
```bash
gulp build
```

2. Next type this command into the Terminal.
```bash
gulp watch
```

*Note: `gulp watch` checks for any changes in the file. Any changes saved will be rebuilt.*

3. Keep typing in the command until you're not prompted to enter a new command. 

4. Open a new Chrome tab.


------------------------------------COMPLETE------------------------------------
