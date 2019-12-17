namespace MapGenerator.WellSpreadMap
{
    partial class SpreadController
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.textBox1 = new System.Windows.Forms.TextBox();
            this.button1 = new System.Windows.Forms.Button();
            this.panel1 = new System.Windows.Forms.Panel();
            this.shakePosition = new System.Windows.Forms.CheckBox();
            this.roundGalaxy = new System.Windows.Forms.CheckBox();
            this.SuspendLayout();
            // 
            // textBox1
            // 
            this.textBox1.Location = new System.Drawing.Point(12, 12);
            this.textBox1.Multiline = true;
            this.textBox1.Name = "textBox1";
            this.textBox1.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.textBox1.Size = new System.Drawing.Size(448, 395);
            this.textBox1.TabIndex = 1;
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(385, 471);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(75, 23);
            this.button1.TabIndex = 2;
            this.button1.Text = "generate";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // panel1
            // 
            this.panel1.BackColor = System.Drawing.SystemColors.ActiveCaptionText;
            this.panel1.Location = new System.Drawing.Point(466, 12);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(1008, 619);
            this.panel1.TabIndex = 3;
            this.panel1.Paint += new System.Windows.Forms.PaintEventHandler(this.panel1_Paint);
            // 
            // shakePosition
            // 
            this.shakePosition.AutoSize = true;
            this.shakePosition.Checked = true;
            this.shakePosition.CheckState = System.Windows.Forms.CheckState.Checked;
            this.shakePosition.Location = new System.Drawing.Point(365, 413);
            this.shakePosition.Name = "shakePosition";
            this.shakePosition.Size = new System.Drawing.Size(95, 17);
            this.shakePosition.TabIndex = 4;
            this.shakePosition.Text = "shake Position";
            this.shakePosition.UseVisualStyleBackColor = true;
            // 
            // roundGalaxy
            // 
            this.roundGalaxy.AutoSize = true;
            this.roundGalaxy.Checked = true;
            this.roundGalaxy.CheckState = System.Windows.Forms.CheckState.Checked;
            this.roundGalaxy.Location = new System.Drawing.Point(365, 436);
            this.roundGalaxy.Name = "roundGalaxy";
            this.roundGalaxy.Size = new System.Drawing.Size(88, 17);
            this.roundGalaxy.TabIndex = 5;
            this.roundGalaxy.Text = "round Galaxy";
            this.roundGalaxy.UseVisualStyleBackColor = true;
            // 
            // SpreadController
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1553, 754);
            this.Controls.Add(this.roundGalaxy);
            this.Controls.Add(this.shakePosition);
            this.Controls.Add(this.panel1);
            this.Controls.Add(this.button1);
            this.Controls.Add(this.textBox1);
            this.Name = "SpreadController";
            this.Text = "SpreadController";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.TextBox textBox1;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.CheckBox shakePosition;
        private System.Windows.Forms.CheckBox roundGalaxy;
    }
}