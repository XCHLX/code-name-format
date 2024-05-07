namespace CodeNameFormat.Forms
{
    partial class SetForm
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
            this.BtnSave = new System.Windows.Forms.Button();
            this.TxtBaiduAPPKEY = new System.Windows.Forms.TextBox();
            this.TxtBaiduSecretKey = new System.Windows.Forms.TextBox();
            this.LbaiduKey = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.linkLabelBaidu = new System.Windows.Forms.LinkLabel();
            this.linkLabelTencent = new System.Windows.Forms.LinkLabel();
            this.label3 = new System.Windows.Forms.Label();
            this.lblTencentKey = new System.Windows.Forms.Label();
            this.TxtTencentSecretKey = new System.Windows.Forms.TextBox();
            this.TxtTencentAPPKEY = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.CB = new System.Windows.Forms.ComboBox();
            this.SuspendLayout();
            // 
            // BtnSave
            // 
            this.BtnSave.Location = new System.Drawing.Point(455, 128);
            this.BtnSave.Name = "BtnSave";
            this.BtnSave.Size = new System.Drawing.Size(75, 23);
            this.BtnSave.TabIndex = 0;
            this.BtnSave.Text = "保存";
            this.BtnSave.UseVisualStyleBackColor = true;
            this.BtnSave.Click += new System.EventHandler(this.BtnSave_Click);
            // 
            // TxtBaiduAPPKEY
            // 
            this.TxtBaiduAPPKEY.Location = new System.Drawing.Point(109, 60);
            this.TxtBaiduAPPKEY.Name = "TxtBaiduAPPKEY";
            this.TxtBaiduAPPKEY.Size = new System.Drawing.Size(178, 21);
            this.TxtBaiduAPPKEY.TabIndex = 1;
            // 
            // TxtBaiduSecretKey
            // 
            this.TxtBaiduSecretKey.Location = new System.Drawing.Point(352, 60);
            this.TxtBaiduSecretKey.Name = "TxtBaiduSecretKey";
            this.TxtBaiduSecretKey.Size = new System.Drawing.Size(178, 21);
            this.TxtBaiduSecretKey.TabIndex = 2;
            // 
            // LbaiduKey
            // 
            this.LbaiduKey.AutoSize = true;
            this.LbaiduKey.Location = new System.Drawing.Point(50, 63);
            this.LbaiduKey.Name = "LbaiduKey";
            this.LbaiduKey.Size = new System.Drawing.Size(47, 12);
            this.LbaiduKey.TabIndex = 3;
            this.LbaiduKey.Text = "百度key";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(293, 63);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(53, 12);
            this.label2.TabIndex = 4;
            this.label2.Text = "百度密钥";
            // 
            // linkLabelBaidu
            // 
            this.linkLabelBaidu.AutoSize = true;
            this.linkLabelBaidu.Location = new System.Drawing.Point(536, 63);
            this.linkLabelBaidu.Name = "linkLabelBaidu";
            this.linkLabelBaidu.Size = new System.Drawing.Size(77, 12);
            this.linkLabelBaidu.TabIndex = 5;
            this.linkLabelBaidu.TabStop = true;
            this.linkLabelBaidu.Text = "申请百度翻译";
            this.linkLabelBaidu.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.LinkLabelBaidu_LinkClicked);
            // 
            // linkLabelTencent
            // 
            this.linkLabelTencent.AutoSize = true;
            this.linkLabelTencent.Location = new System.Drawing.Point(536, 104);
            this.linkLabelTencent.Name = "linkLabelTencent";
            this.linkLabelTencent.Size = new System.Drawing.Size(77, 12);
            this.linkLabelTencent.TabIndex = 10;
            this.linkLabelTencent.TabStop = true;
            this.linkLabelTencent.Text = "申请腾讯翻译";
            this.linkLabelTencent.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.LinkLabelTencent_LinkClicked);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(293, 104);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(53, 12);
            this.label3.TabIndex = 9;
            this.label3.Text = "腾讯密钥";
            // 
            // lblTencentKey
            // 
            this.lblTencentKey.AutoSize = true;
            this.lblTencentKey.Location = new System.Drawing.Point(50, 104);
            this.lblTencentKey.Name = "lblTencentKey";
            this.lblTencentKey.Size = new System.Drawing.Size(47, 12);
            this.lblTencentKey.TabIndex = 8;
            this.lblTencentKey.Text = "腾讯key";
            // 
            // TxtTencentSecretKey
            // 
            this.TxtTencentSecretKey.Location = new System.Drawing.Point(352, 101);
            this.TxtTencentSecretKey.Name = "TxtTencentSecretKey";
            this.TxtTencentSecretKey.Size = new System.Drawing.Size(178, 21);
            this.TxtTencentSecretKey.TabIndex = 7;
            // 
            // TxtTencentAPPKEY
            // 
            this.TxtTencentAPPKEY.Location = new System.Drawing.Point(109, 101);
            this.TxtTencentAPPKEY.Name = "TxtTencentAPPKEY";
            this.TxtTencentAPPKEY.Size = new System.Drawing.Size(178, 21);
            this.TxtTencentAPPKEY.TabIndex = 6;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(50, 21);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(53, 12);
            this.label1.TabIndex = 11;
            this.label1.Text = "默认翻译";
            // 
            // CB
            // 
            this.CB.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.CB.FormattingEnabled = true;
            this.CB.Items.AddRange(new object[] {
            "百度翻译",
            "腾讯翻译"});
            this.CB.Location = new System.Drawing.Point(109, 18);
            this.CB.Name = "CB";
            this.CB.Size = new System.Drawing.Size(121, 20);
            this.CB.TabIndex = 12;
            // 
            // SetForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(685, 179);
            this.Controls.Add(this.CB);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.linkLabelTencent);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.lblTencentKey);
            this.Controls.Add(this.TxtTencentSecretKey);
            this.Controls.Add(this.TxtTencentAPPKEY);
            this.Controls.Add(this.linkLabelBaidu);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.LbaiduKey);
            this.Controls.Add(this.TxtBaiduSecretKey);
            this.Controls.Add(this.TxtBaiduAPPKEY);
            this.Controls.Add(this.BtnSave);
            this.Name = "SetForm";
            this.Text = "SetForm";
            this.Load += new System.EventHandler(this.SetForm_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button BtnSave;
        private System.Windows.Forms.TextBox TxtBaiduAPPKEY;
        private System.Windows.Forms.TextBox TxtBaiduSecretKey;
        private System.Windows.Forms.Label LbaiduKey;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.LinkLabel linkLabelBaidu;
        private System.Windows.Forms.LinkLabel linkLabelTencent;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label lblTencentKey;
        private System.Windows.Forms.TextBox TxtTencentSecretKey;
        private System.Windows.Forms.TextBox TxtTencentAPPKEY;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.ComboBox CB;
    }
}