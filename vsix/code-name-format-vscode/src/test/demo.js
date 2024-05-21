const fetchData = async url => {
  try {
    const response = await fetchData2(url);
    console.log(response);
    return response;
  } catch (error) {
    return error;
  }
};

async function fetchData2(url) {
  return await new Promise((resolve, reject) => {
    try {
      for (let index = 0; index < 10; index++) {
        console.log(index);
      }
      resolve('100');
    } catch (error) {
      reject(error);
    }
  });
}

async function main() {
  var data = await fetchData();
  console.log('hello' + data);
}

main();
