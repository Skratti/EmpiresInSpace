using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace EmpiresInSpace
{
    public class Helpers
    {
        static void redirectToIndex()
        {
        }

        public static string StripHtmlAttributes(string s)
        {
            const string pattern = @"\s.+?=[""'].+?[""']";
            var result = Regex.Replace(s, pattern, string.Empty);
            return result;
        }

        public static string Remove_Html_Tags(string Html)
        {
            string Only_Text = Regex.Replace(Html, @"<(.|\n)*?>", string.Empty);

            return Only_Text;
        }

        public static string StripUserHtml(string input)
        {
            var whiteList = new List<Word>();
            whiteList.Add(new Word() { SearchWord = "<p>", ReplaceWord = "&lt;p&gt;" });
            whiteList.Add(new Word() { SearchWord = "</p>", ReplaceWord = "&lt;/p&gt;" });
            whiteList.Add(new Word() { SearchWord = "<br>", ReplaceWord = "&lt;br&gt;" });
            whiteList.Add(new Word() { SearchWord = "<br/>", ReplaceWord = "&lt;br/&gt;" });
            whiteList.Add(new Word() { SearchWord = "<br />", ReplaceWord = "&lt;br /&gt;" });

            whiteList.Add(new Word() { SearchWord = "<font", ReplaceWord = "&lt;font&gt;" });
            whiteList.Add(new Word() { SearchWord = "</font>", ReplaceWord = "&lt;/font&gt;" });
            whiteList.Add(new Word() { SearchWord = "<img", ReplaceWord = "&lt;img&gt;" });
            whiteList.Add(new Word() { SearchWord = "</img", ReplaceWord = "&lt;/img&gt;" });
            whiteList.Add(new Word() { SearchWord = "<h1>", ReplaceWord = "&lt;h1&gt;" });
            whiteList.Add(new Word() { SearchWord = "</h1>", ReplaceWord = "&lt;/h1&gt;" });
            whiteList.Add(new Word() { SearchWord = "<h2>", ReplaceWord = "&lt;h2&gt;" });
            whiteList.Add(new Word() { SearchWord = "</h2>", ReplaceWord = "&lt;/h2&gt;" });
            whiteList.Add(new Word() { SearchWord = "<h3>", ReplaceWord = "&lt;h3&gt;" });
            whiteList.Add(new Word() { SearchWord = "</h3>", ReplaceWord = "&lt;/h3&gt;" });
            whiteList.Add(new Word() { SearchWord = "<h4>", ReplaceWord = "&lt;h4&gt;" });
            whiteList.Add(new Word() { SearchWord = "</h4>", ReplaceWord = "&lt;/h4&gt;" });
            whiteList.Add(new Word() { SearchWord = "<h5>", ReplaceWord = "&lt;h5&gt;" });
            whiteList.Add(new Word() { SearchWord = "</h5>", ReplaceWord = "&lt;/h5&gt;" });


            whiteList.Add(new Word() { SearchWord = "<i>", ReplaceWord = "&lt;i&gt;" });
            whiteList.Add(new Word() { SearchWord = "</i>", ReplaceWord = "&lt;/i&gt;" });
            whiteList.Add(new Word() { SearchWord = "<b>", ReplaceWord = "&lt;b&gt;" });
            whiteList.Add(new Word() { SearchWord = "</b>", ReplaceWord = "&lt;/b&gt;" });
            whiteList.Add(new Word() { SearchWord = "<u>", ReplaceWord = "&lt;u&gt;" });
            whiteList.Add(new Word() { SearchWord = "</u>", ReplaceWord = "&lt;/u&gt;" });
            whiteList.Add(new Word() { SearchWord = "<span>", ReplaceWord = "&lt;span&gt;" });
            whiteList.Add(new Word() { SearchWord = "</span>", ReplaceWord = "&lt;/span&gt;" });
            whiteList.Add(new Word() { SearchWord = "<div>", ReplaceWord = "&lt;i&gt;" });
            whiteList.Add(new Word() { SearchWord = "</div>", ReplaceWord = "&lt;/i&gt;" });
            whiteList.Add(new Word() { SearchWord = "<i>", ReplaceWord = "&lt;i&gt;" });
            whiteList.Add(new Word() { SearchWord = "</i>", ReplaceWord = "&lt;/i&gt;" });

            // <p> <br> <font> <img> <h1> <h2> <h3> <h4> <h5> <i> <b> <u> <span> <div>
          

         


            //"sup|sub|ol|ul|li|a|blockquote";

            //img and font may have attributes
            //<p>,</p>,<br>,<br/>,<br />,<font,</font>,<img>,</img>,<h1>,</h1>,<h2>,</h2>,<h3>,</h3>,<h4>,</h4>,<h5>,</h5>,<i>,</i>,<b>,</b>,<u>,</u>,<span>,</span>,<div>,</div>,<i>,</i>



            whiteList.ForEach(w => input = input.Replace(w.SearchWord, w.ReplaceWord));
            var remove = Remove_Html_Tags(input);
            whiteList.ForEach(w => remove = remove.Replace(w.ReplaceWord, w.SearchWord));
            //remove = StripHtmlAttributes(remove);
         

            return remove;
        }
    }


    public class Word
    {
        public string SearchWord;
        public string ReplaceWord;

        public Word(string SearchWord = "<p>", string ReplaceWord = "&lt;p&gt;")
        {
            this.SearchWord = SearchWord;
            this.ReplaceWord = ReplaceWord;
        }


    }

    
}