using CodeNameFormat.Tools;
using System;
using System.Windows.Forms;

namespace CodeNameFormat.Forms
{
    public partial class SetForm : Form
    {
        public SetForm()
        {
            InitializeComponent();
        }

        /// <summary>
        /// 保存配置
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void BtnSave_Click(object sender, EventArgs e)
        {
            var baiduapi = TxtBaiduAPPKEY.Text;
            var baiduSecretKey = TxtBaiduSecretKey.Text;

            var tencentApi = TxtTencentAPPKEY.Text;
            var tencentSecretKey = TxtTencentSecretKey.Text;

            var type = CB.SelectedItem.ToString();

            FileTools.WriteFileConfig(baiduapi, baiduSecretKey, tencentApi, tencentSecretKey, type);

            this.Close();
        }

        /// <summary>
        /// 腾讯
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void SetForm_Load(object sender, EventArgs e)
        {
            var config = FileTools.ReadFileConfig();
            var tencent = config.Item2;
            var baidu = config.Item1;
            var type = config.Item3;
            if (!string.IsNullOrWhiteSpace(baidu))
            {
                if (baidu.Split(',').Length > 1)
                {
                    TxtBaiduAPPKEY.Text = baidu.Split(',')[0];
                    TxtBaiduSecretKey.Text = baidu.Split(',')[1];
                }
            }
            if (!string.IsNullOrWhiteSpace(tencent))
            {
                if (tencent.Split(',').Length > 1)
                {
                    TxtTencentAPPKEY.Text = tencent.Split(',')[0];
                    TxtTencentSecretKey.Text = tencent.Split(',')[1];
                }
            }
            if (!string.IsNullOrWhiteSpace(type))
            {
                CB.SelectedItem = type;
            }
            else
            {
                CB.SelectedItem = "百度翻译";
            }
        }

        /// <summary>
        /// 腾讯
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void LinkLabelTencent_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            System.Diagnostics.Process.Start("https://hcfy.app/docs/services/baidu-api");
        }

        /// <summary>
        /// 百度
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void LinkLabelBaidu_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            System.Diagnostics.Process.Start("https://hcfy.app/docs/services/baidu-api");
        }
    }
}