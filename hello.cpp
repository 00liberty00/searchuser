#ifndef UNICODE
#define UNICODE
#endif
#pragma comment(lib, "netapi32.lib")

#include <stdio.h>
#include <windows.h>
#include <lm.h>
#include <locale.h>
#include <napi.h>
#include <iostream>
#include <string>

Napi::Array Method(const Napi::CallbackInfo &info)
{

  setlocale(LC_ALL, "Rus");
  DWORD dwlevel = 0;
  DWORD dwfilter = 0;
  USER_INFO_0 *theEntries = new USER_INFO_0[7];
  DWORD dwprefmaxlen = 512;
  DWORD dwentriesread;
  DWORD dwtotalentries;
  NET_API_STATUS result;

  Napi::Env env = info.Env();
  Napi::Array company_array = Napi::Array::New(info.Env(), 4);
  using namespace std;
  result = NetUserEnum(NULL, 0, 0, (LPBYTE *)&theEntries, dwprefmaxlen, &dwentriesread, &dwtotalentries, NULL);
  for (size_t i = 0; i < dwentriesread; i++)
  {
    // int convertdata = static_cast<int>(i);
    // Determine the length of the converted string
    int strLength = WideCharToMultiByte(CP_UTF8, 0, theEntries->usri0_name, -1,
                                        nullptr, 0, nullptr, nullptr);

    // Create a std::string with the determined length
    string name(strLength, 0);

    // Perform the conversion from LPCWSTR to std::string
    WideCharToMultiByte(CP_UTF8, 0, theEntries->usri0_name, -1, &name[0],
                        strLength, nullptr, nullptr);

    company_array[i] = name;
    theEntries++;
  }
  // arr.Set(2, "xxx");

  return company_array;
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
  exports.Set(Napi::String::New(env, "helloo"), Napi::Function::New(env, Method));
  return exports;
}

NODE_API_MODULE(hello, Init)
