SWFUpload (Maintained for Security Fixes)
=========================================

This is a fork of the long-abandoned [SWFUpload project](https://code.google.com/p/swfupload/), maintained by WordPress and others to ensure that a secure version of SWFUpload exists.

**We strongly suggest you do not use SWFUpload. But if you must, use this fork.**

WordPress is maintaining a secure version of SWFUpload for use by WordPress plugins that have yet to be updated to use [Plupload](http://plupload.com/), our upload library of choice. Plupload is was written and is actively maintained by [Moxiecode](http://www.moxiecode.com/), the developers of [TinyMCE](http://www.tinymce.com/).

We do not condone the use of abandonware. We only wish to make the web a better place by ensuring that developers have access to a secure version of SWFUpload, when the only alternative may be to use insecure code.

Reporting Security Vulnerabilities
----------------------------------

If you think you have found a vulnerability in this fork of SWFUpload, we appreciate your help in disclosing it to us responsibly. **Please email reports of security vulnerabilities to swfupload-security@wordpress.org.** These reports will be reviewed by the WordPress security team and by contributing security researchers, including [Neal Poole](http://nealpoole.com) and [Szymon Gruszecki](http://mars.iti.pk.edu.pl/~grucha/), who have previously identified vulnerabilities in SWFUpload.

Fixed Vulnerabilities
---------------------

 * CVE-2013-2205, in c6165608855eeab00f8fea92606ed5be418124a4. Reported to WordPress by [Szymon Gruszecki](http://mars.iti.pk.edu.pl/~grucha/).
 * CVE-2012-3414, in 1127712c89f33a1324591de07a27fa2eb205673b. Reported to WordPress by [Neal Poole](http://nealpoole.com) and [Nathan Partlan](http://greywhind.wordpress.com).
 * CVE-2012-2399, in f6e5097c32d4680fe66ed04c91926959ed763d52. Reported to WordPress by [Szymon Gruszecki](http://mars.iti.pk.edu.pl/~grucha/).

Acknowledgements
----------------

Over the years, a number of individuals and companies have identified security vulnerabilites in SWFUpload. This fork of SWFUpload includes contributions from:
 * [Yelp](http://engineeringblog.yelp.com)
 * [Neal Poole](http://nealpoole.com)
 * [Nathan Partlan](http://greywhind.wordpress.com)
 * [Szymon Gruszecki](http://mars.iti.pk.edu.pl/~grucha/)


Submitting Bug Fixes and New Features
-------------------------------------

This fork of SWFUpload is maintained for security features only. Features will not be accepted. (We'll again recommend [Plupload](http://plupload.com/).)

Discrete bug fixes could be considered on a case-by-case basis through a pull request. We do not wish to condone any time spent on SWFUpload, as we find that to be time wasted. But, if you have a desire to help maintain SWFUpload, contact swfupload-security@wordpress.org.

Report security vulnerabilities to swfupload-security@wordpress.org.

License
-------

Like the original SWFUpload, this is licensed under MIT: http://rem.mit-license.org/

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.